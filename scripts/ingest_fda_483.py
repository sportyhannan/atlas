#!/usr/bin/env python3
"""
Ingest FDA 483 warning letters and BMIS investigator data.

Sources:
- FDA Inspection Observations: https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-references/inspection-observations
- FDA BMIS: https://www.fda.gov/drugs/drug-approvals-and-databases/bioresearch-monitoring-information-system-bmis

Usage:
  pip install httpx beautifulsoup4 supabase python-dotenv
  python scripts/ingest_fda_483.py
"""

import os, json, time, re
from dotenv import load_dotenv
import httpx
from bs4 import BeautifulSoup

load_dotenv('.env.local')

SUPABASE_URL = os.environ.get('NEXT_PUBLIC_SUPABASE_URL', '')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')

FDA_483_BASE = 'https://www.accessdata.fda.gov/scripts/warningletters/wlSearchResult.cfm'
FDA_BMIS_URL = 'https://www.fda.gov/drugs/drug-approvals-and-databases/bioresearch-monitoring-information-system-bmis'

# Clinical investigator-related FDA search filters
INVESTIGATOR_TERMS = [
    'clinical investigator',
    'bioresearch monitoring',
    '1572',
]


def fetch_warning_letters(term: str = 'clinical investigator', max_results: int = 100) -> list[dict]:
    """
    Fetch warning letters from FDA's searchable database.
    The FDA warning letters page is HTML-based, not a REST API.
    We parse the search results table.
    """
    letters = []
    params = {
        'searchterm': term,
        'issuedate': 'LAST5YEARS',
        'maxcount': max_results,
        'SearchType': 'All',
    }
    try:
        resp = httpx.post(FDA_483_BASE, data=params, timeout=30, follow_redirects=True)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'html.parser')
        rows = soup.select('table.table tbody tr')
        for row in rows:
            cells = row.select('td')
            if len(cells) < 4:
                continue
            link_elem = cells[0].find('a')
            letter = {
                'subject': cells[0].get_text(strip=True),
                'company': cells[1].get_text(strip=True),
                'date': cells[2].get_text(strip=True),
                'issuing_office': cells[3].get_text(strip=True) if len(cells) > 3 else '',
                'url': link_elem['href'] if link_elem and link_elem.get('href') else '',
            }
            # Extract investigator names from subject line using heuristics
            # Format often: "Dr. John Smith, MD, Site Name"
            names = re.findall(r'(?:Dr\.\s+|Dr\s+)?([A-Z][a-z]+ [A-Z][a-z]+(?:,\s*(?:MD|PhD|DO|MBBS))*)', letter['subject'])
            letter['investigator_names'] = names
            letters.append(letter)
    except Exception as e:
        print(f'  Error fetching warning letters for "{term}": {e}')
    return letters


def supabase_upsert(table: str, rows: list[dict]) -> None:
    if not rows or not SUPABASE_URL:
        return
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
    }
    resp = httpx.post(f'{SUPABASE_URL}/rest/v1/{table}', headers=headers, json=rows, timeout=30)
    if resp.status_code not in (200, 201):
        print(f'  Supabase error ({table}): {resp.status_code} — {resp.text[:200]}')


def main():
    print('=== Atlas FDA 483 + BMIS ingestion ===\n')

    all_letters = []
    for term in INVESTIGATOR_TERMS:
        print(f'Fetching FDA warning letters: "{term}"…')
        letters = fetch_warning_letters(term, max_results=50)
        print(f'  → {len(letters)} letters')
        all_letters.extend(letters)
        time.sleep(1)  # rate limit FDA

    # Deduplicate
    seen = set()
    unique_letters = []
    for letter in all_letters:
        key = letter['subject'] + letter['date']
        if key not in seen:
            seen.add(key)
            unique_letters.append(letter)

    print(f'\nTotal unique warning letters: {len(unique_letters)}')

    # Extract investigator names and flag them
    flagged_investigators = set()
    for letter in unique_letters:
        for name in letter.get('investigator_names', []):
            flagged_investigators.add(name.strip().lower())

    print(f'Investigators with 483 flags: {len(flagged_investigators)}')

    # Save locally
    output = {
        'letters': unique_letters,
        'flagged_investigator_names': list(flagged_investigators),
    }
    with open('scripts/fda_483_data.json', 'w') as f:
        json.dump(output, f, indent=2)

    # Upsert regulatory actions to Supabase
    if unique_letters:
        supabase_rows = [{
            'action_type': '483 Warning Letter',
            'date': letter.get('date', ''),
            'summary': letter.get('subject', '')[:500],
            'source_url': letter.get('url', ''),
        } for letter in unique_letters[:100]]
        supabase_upsert('regulatory_actions', supabase_rows)
        print(f'Upserted {len(supabase_rows)} regulatory actions to Supabase')

    print('\nDone. See scripts/fda_483_data.json for full output.')
    print('\nNext step: match flagged investigator names against investigators table')
    print('  UPDATE investigators SET has_483_flag = true WHERE full_name ILIKE ANY(ARRAY[...])')


if __name__ == '__main__':
    main()
