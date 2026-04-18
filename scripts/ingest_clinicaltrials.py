#!/usr/bin/env python3
"""
Ingest investigators from ClinicalTrials.gov API v2 + PubMed into Supabase.

Usage:
  pip install httpx supabase python-dotenv
  python scripts/ingest_clinicaltrials.py

Env vars required (.env.local):
  NEXT_PUBLIC_SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY   (NOT the anon key — service role for inserts)
"""

import os, json, time, re, hashlib
from typing import Optional
from dotenv import load_dotenv
import httpx

load_dotenv('.env.local')

SUPABASE_URL = os.environ['NEXT_PUBLIC_SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_SERVICE_ROLE_KEY']

CT_BASE = 'https://clinicaltrials.gov/api/v2'
PM_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'
NCBI_EMAIL = 'atlas-trials@hackprinceton.dev'

DEMO_QUERIES = [
    {'term': 'odronextamab OR cemiplimab OR linvoseltamab', 'indication': 'R/R DLBCL'},
    {'term': 'diffuse large B-cell lymphoma relapsed refractory', 'indication': 'R/R DLBCL'},
    {'term': 'non-small cell lung cancer cemiplimab', 'indication': 'NSCLC'},
    {'term': 'HER2-positive breast cancer metastatic', 'indication': 'HER2+ breast cancer'},
    {'term': 'hemophilia B fitusiran linvoseltamab', 'indication': 'Hemophilia B'},
]

COUNTRY_PRIORITIES = ['NG', 'ZA', 'KR', 'JP', 'BR', 'IN', 'PL', 'IT', 'DE', 'FR', 'US', 'GB']


def ct_search(term: str, page_size: int = 200) -> list[dict]:
    """Fetch studies from ClinicalTrials.gov v2."""
    params = {
        'query.term': term,
        'filter.overallStatus': 'RECRUITING,ACTIVE_NOT_RECRUITING,COMPLETED',
        'pageSize': page_size,
        'fields': 'NCTId,BriefTitle,Phase,OverallStatus,Condition,InterventionName,ResponsiblePartyInvestigatorFullName,LocationFacility,LocationCity,LocationCountry,LocationContactName,EnrollmentCount,StartDate,PrimaryCompletionDate',
    }
    resp = httpx.get(f'{CT_BASE}/studies', params=params, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    return data.get('studies', [])


def extract_investigators(study: dict) -> list[dict]:
    """Extract investigator records from a ClinicalTrials.gov study JSON."""
    investigators = []
    protocol = study.get('protocolSection', {})
    identification = protocol.get('identificationModule', {})
    status = protocol.get('statusModule', {})
    contacts = protocol.get('contactsLocationsModule', {})

    nct_id = identification.get('nctId', '')
    phase = protocol.get('designModule', {}).get('phases', ['Unknown'])[0] if protocol.get('designModule', {}).get('phases') else 'Unknown'
    title = identification.get('briefTitle', '')
    overall_status = status.get('overallStatus', '')
    enrollment = protocol.get('enrollmentInfo', {}).get('count', 0)

    responsible_party = protocol.get('sponsorCollaboratorsModule', {}).get('responsibleParty', {})
    pi_name = responsible_party.get('investigatorFullName')
    pi_affiliation = responsible_party.get('investigatorAffiliation')

    locations = contacts.get('locations', [])
    for loc in locations:
        city = loc.get('city', '')
        country = loc.get('country', '')
        facility = loc.get('facility', '')
        loc_contacts = loc.get('contacts', [])

        # Named contacts at location
        for contact in loc_contacts:
            name = contact.get('name', '').strip()
            role = contact.get('role', '').strip()
            if not name or len(name) < 4:
                continue
            investigators.append({
                'name': name,
                'site': facility,
                'city': city,
                'country': country,
                'role': role,
                'nct_id': nct_id,
                'phase': phase,
                'trial_title': title,
                'trial_status': overall_status,
                'enrollment': enrollment,
            })

    # Principal investigator from responsible party
    if pi_name and len(pi_name) > 4:
        first_loc = locations[0] if locations else {}
        investigators.append({
            'name': pi_name,
            'site': pi_affiliation or first_loc.get('facility', ''),
            'city': first_loc.get('city', ''),
            'country': first_loc.get('country', ''),
            'role': 'PI',
            'nct_id': nct_id,
            'phase': phase,
            'trial_title': title,
            'trial_status': overall_status,
            'enrollment': enrollment,
        })

    return investigators


def pubmed_search(author: str, indication: str, year_from: int = 2021) -> list[dict]:
    """Search PubMed for publications by an author in an indication."""
    query = f'{author}[Author] AND {indication}[Title/Abstract] AND {year_from}:{2026}[PDAT]'
    params = {
        'db': 'pubmed',
        'term': query,
        'retmax': 10,
        'retmode': 'json',
        'tool': 'atlas-hackprinceton',
        'email': NCBI_EMAIL,
    }
    try:
        resp = httpx.get(f'{PM_BASE}/esearch.fcgi', params=params, timeout=15)
        resp.raise_for_status()
        ids = resp.json().get('esearchresult', {}).get('idlist', [])
        if not ids:
            return []
        # Fetch summaries
        sum_params = {
            'db': 'pubmed',
            'id': ','.join(ids[:5]),
            'retmode': 'json',
            'tool': 'atlas-hackprinceton',
            'email': NCBI_EMAIL,
        }
        sum_resp = httpx.get(f'{PM_BASE}/esummary.fcgi', params=sum_params, timeout=15)
        sum_resp.raise_for_status()
        result = sum_resp.json().get('result', {})
        pubs = []
        for pid in ids[:5]:
            article = result.get(pid, {})
            pubs.append({
                'pubmedId': pid,
                'title': article.get('title', ''),
                'year': int(article.get('pubdate', '2024')[:4]) if article.get('pubdate') else 2024,
                'journal': article.get('source', ''),
                'citationCount': 0,  # Would need CrossRef or S2 API
            })
        return pubs
    except Exception as e:
        print(f'  PubMed error for {author}: {e}')
        return []


def supabase_upsert(table: str, rows: list[dict]) -> None:
    """Upsert rows into Supabase via REST API."""
    if not rows:
        return
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
    }
    resp = httpx.post(
        f'{SUPABASE_URL}/rest/v1/{table}',
        headers=headers,
        json=rows,
        timeout=30,
    )
    if resp.status_code not in (200, 201):
        print(f'  Supabase error ({table}): {resp.status_code} — {resp.text[:200]}')


def make_initials(name: str) -> str:
    parts = name.split()
    if len(parts) >= 2:
        return (parts[0][0] + parts[-1][0]).upper()
    return name[:2].upper()


def main():
    all_investigators: dict[str, dict] = {}  # keyed by normalized name+site

    print('=== Atlas data ingestion — ClinicalTrials.gov + PubMed ===\n')

    for q in DEMO_QUERIES:
        print(f'Querying ClinicalTrials.gov: {q["term"][:60]}…')
        try:
            studies = ct_search(q['term'], page_size=100)
            print(f'  → {len(studies)} studies')
            for study in studies:
                investigators = extract_investigators(study)
                for inv in investigators:
                    # Deduplicate by name + site
                    key = f"{inv['name'].lower().strip()}|{inv['site'].lower().strip()}"
                    h = hashlib.md5(key.encode()).hexdigest()[:12]
                    if h not in all_investigators:
                        all_investigators[h] = {
                            'id': h,
                            'full_name': inv['name'],
                            'initials': make_initials(inv['name']),
                            'site': inv['site'],
                            'city': inv['city'],
                            'country': inv['country'],
                            'indication_tags': [q['indication']],
                            'phase_experience': [inv['phase']] if inv['phase'] != 'Unknown' else [],
                            'trials': [{'nctId': inv['nct_id'], 'title': inv['trial_title'], 'phase': inv['phase'], 'status': inv['trial_status'], 'role': inv['role']}],
                            'enrollments': inv.get('enrollment', 0) or 0,
                            'is_rising_star': False,
                            'fit': 70,  # placeholder, scored by agent
                        }
                    else:
                        existing = all_investigators[h]
                        if q['indication'] not in existing['indication_tags']:
                            existing['indication_tags'].append(q['indication'])
                        if inv['phase'] != 'Unknown' and inv['phase'] not in existing['phase_experience']:
                            existing['phase_experience'].append(inv['phase'])
                        trial_entry = {'nctId': inv['nct_id'], 'title': inv['trial_title'], 'phase': inv['phase'], 'status': inv['trial_status'], 'role': inv['role']}
                        if trial_entry not in existing['trials']:
                            existing['trials'].append(trial_entry)
        except Exception as e:
            print(f'  Error: {e}')
        time.sleep(0.3)  # rate limit

    print(f'\nExtracted {len(all_investigators)} unique investigators\n')

    # Enrich top 100 with PubMed
    sorted_invs = sorted(all_investigators.values(), key=lambda i: len(i['trials']), reverse=True)[:100]
    print(f'Enriching top {len(sorted_invs)} with PubMed…')
    for inv in sorted_invs:
        indication = inv['indication_tags'][0] if inv['indication_tags'] else ''
        pubs = pubmed_search(inv['full_name'], indication)
        inv['publications'] = pubs
        inv['is_rising_star'] = (len(inv['trials']) <= 1 and len(pubs) >= 2)
        time.sleep(0.35)  # NCBI rate limit: ~3 req/sec

    # Mark rising stars with 0–1 industry trials + 2+ relevant pubs
    rising_count = sum(1 for i in sorted_invs if i.get('is_rising_star'))
    print(f'  → {rising_count} rising stars identified')

    # Write to Supabase
    print('\nUpserting to Supabase investigators table…')
    supabase_rows = []
    for inv in sorted_invs:
        supabase_rows.append({
            'id': inv['id'],
            'full_name': inv['full_name'],
            'city': inv['city'],
            'country': inv['country'],
            'indication_tags': inv['indication_tags'],
            'phase_experience': inv['phase_experience'],
            'is_rising_star': inv.get('is_rising_star', False),
            'rare_disease': 'Hemophilia' in ' '.join(inv['indication_tags']),
        })

    # Upsert in batches of 50
    for i in range(0, len(supabase_rows), 50):
        batch = supabase_rows[i:i+50]
        supabase_upsert('investigators', batch)
        print(f'  Upserted batch {i//50 + 1} ({len(batch)} rows)')

    # Save full enriched data locally for inspection
    with open('scripts/ingested_investigators.json', 'w') as f:
        json.dump(sorted_invs, f, indent=2, default=str)

    print(f'\nDone. {len(sorted_invs)} investigators written to Supabase + scripts/ingested_investigators.json')


if __name__ == '__main__':
    main()
