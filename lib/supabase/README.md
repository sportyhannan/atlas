# Data Sources README

This document describes the data sources ingested into the pipeline, their schemas, and key fields.

---

## Table of Contents

1. [clinicaltrials_studies](#1-clinicaltrials_studies)
2. [clinicaltrials_investigators](#2-clinicaltrials_investigators)
3. [pubmed_articles](#3-pubmed_articles)
4. [npi_providers](#4-npi_providers)
5. [fda_bmis](#5-fda_bmis)
6. [fda_483_letters](#6-fda_483_letters)
7. [fda_inspection_observations](#7-fda_inspection_observations)
8. [openalex_authors](#8-openalex_authors)
9. [openalex_works](#9-openalex_works)
10. [ictrp_trials](#10-ictrp_trials)
11. [cms_open_payments](#11-cms_open_payments)
12. [identity_resolution_matches](#12-identity_resolution_matches)
13. [agent_scoring_runs](#13-agent_scoring_runs)

---

## 1. `clinicaltrials_studies`

**Source:** ClinicalTrials.gov (https://clinicaltrials.gov)

Structured metadata for clinical trials registered on ClinicalTrials.gov. Each row represents one study identified by its NCT ID.

| Field | Type | Description |
|---|---|---|
| `nct_id` | text | ClinicalTrials.gov unique identifier (e.g. NCT01234567) |
| `brief_title` | text | Short public-facing title of the study |
| `official_title` | text | Full official title |
| `phase` | text | Trial phase (Phase 1, 2, 3, 4, N/A) |
| `overall_status` | text | Recruitment/completion status (e.g. Recruiting, Completed) |
| `sponsor` | text | Lead sponsoring organization |
| `responsible_party_type` | text | Sponsor, Investigator, or Sponsor-Investigator |
| `conditions` | text[] | Medical conditions or diseases being studied |
| `interventions` | text[] | Drugs, biologics, devices, or procedures under investigation |
| `enrollment_count` | int | Actual or anticipated number of participants |
| `enrollment_type` | text | Actual or Anticipated |
| `start_date` | text | Study start date |
| `primary_completion_date` | text | Date primary outcome data collection ends |
| `study_type` | text | Interventional or Observational |
| `is_regeneron` | boolean | True if Regeneron is identified as sponsor or responsible party |
| `raw_json` | jsonb | Full raw JSON from ClinicalTrials.gov API |

---

## 2. `clinicaltrials_investigators`

**Source:** ClinicalTrials.gov — extracted from study contact/location records

One row per investigator or site contact associated with a registered trial.

| Field | Type | Description |
|---|---|---|
| `nct_id` | text | Links to `clinicaltrials_studies.nct_id` |
| `full_name` | text | Investigator's full name |
| `role` | text | Role at the site (e.g. Principal Investigator, Sub-Investigator) |
| `affiliation` | text | Institutional affiliation listed in the trial record |
| `facility_name` | text | Name of the participating site or facility |
| `city`, `state`, `country`, `zip` | text | Site location |
| `email`, `phone` | text | Contact details (may be null) |
| `resolved_investigator_id` | text | Links to canonical investigator ID via identity resolution |

---

## 3. `pubmed_articles`

**Source:** NCBI PubMed (https://pubmed.ncbi.nlm.nih.gov)

Bibliographic records for peer-reviewed articles indexed in PubMed.

| Field | Type | Description |
|---|---|---|
| `pubmed_id` | text | PubMed unique identifier (PMID) |
| `doi` | text | Digital Object Identifier |
| `title` | text | Article title |
| `abstract` | text | Article abstract text |
| `journal` | text | Journal name |
| `volume`, `issue` | text | Publication volume and issue |
| `pub_date`, `pub_year` | text / int | Publication date and year |
| `authors_raw` | jsonb | Full author list as returned by PubMed API |
| `mesh_terms` | text[] | MeSH vocabulary terms assigned by NLM |
| `indication_tags` | text[] | Internal tags for therapeutic area classification |
| `citation_count` | int | Number of times cited (if available) |
| `resolved_author_ids` | text[] | Canonical investigator IDs resolved from the author list |

---

## 4. `npi_providers`

**Source:** NPPES National Provider Identifier Registry (https://npiregistry.cms.hhs.gov)

Provider records from the CMS National Plan and Provider Enumeration System (NPPES). Each row is a unique NPI holder.

| Field | Type | Description |
|---|---|---|
| `npi` | text | 10-digit National Provider Identifier |
| `provider_type` | text | Individual or Organization |
| `name_last`, `name_first`, `name_middle` | text | Provider name components |
| `name_credential` | text | Credential suffix (e.g. MD, PhD) |
| `gender` | text | Reported gender |
| `enumeration_date` | date | Date NPI was issued |
| `last_updated`, `deactivation_date` | date | Record update and deactivation dates |
| `primary_taxonomy` | text | NUCC taxonomy code for specialty |
| `taxonomy_desc` | text | Human-readable specialty description |
| `practice_address_1`, `practice_city`, `practice_state`, `practice_zip`, `practice_country` | text | Practice location |
| `practice_phone` | text | Practice phone number |
| `is_oncology` | boolean | True if taxonomy maps to an oncology specialty |
| `resolved_investigator_id` | text | Canonical investigator ID via identity resolution |

---

## 5. `fda_bmis`

**Source:** FDA Bioresearch Monitoring Information System (BMIS)

Records of investigators who have signed FDA Form 1572, committing to GCP compliance for IND studies.

| Field | Type | Description |
|---|---|---|
| `bmis_id` | text | Internal BMIS record identifier |
| `full_name` | text | Investigator name as filed with the FDA |
| `entity_type` | text | Individual or Institution |
| `address_line_1`, `address_line_2`, `city`, `state`, `zip`, `country` | text | Investigator or site address |
| `ind_number` | text | IND (Investigational New Drug) number |
| `submission_type` | text | Type of IND submission |
| `sponsor` | text | Sponsor who filed the IND |
| `receipt_date` | date | Date FDA received the record |
| `study_drug` | text | Drug or biologic under investigation |
| `indication` | text | Therapeutic indication for the study |
| `resolved_investigator_id` | text | Canonical investigator ID via identity resolution |

---

## 6. `fda_483_letters`

**Source:** FDA Warning Letters & Form 483 Inspection Observations (https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations)

Records of FDA inspection letters issued to clinical investigators or site personnel.

| Field | Type | Description |
|---|---|---|
| `subject` | text | Subject line of the letter |
| `company_name` | text | Name of the inspected entity |
| `issuing_office` | text | FDA office that issued the letter |
| `letter_date` | text | Date letter was issued |
| `letter_url` | text | URL to the full letter on FDA.gov |
| `letter_type` | text | Warning Letter, 483, Untitled Letter, etc. |
| `investigator_names_extracted` | text[] | Names extracted from letter text via NLP |
| `observations` | text[] | Parsed inspection observations or violations cited |
| `resolved_investigator_ids` | text[] | Canonical IDs matched to extracted names |

---

## 7. `fda_inspection_observations`

**Source:** FDA Inspection Classification Database

Aggregate-level data on FDA inspection citation categories by fiscal year and program area.

| Field | Type | Description |
|---|---|---|
| `fiscal_year` | int | FDA fiscal year (October–September) |
| `citation_number` | text | Regulatory citation code (e.g. 21 CFR 312.62) |
| `citation_desc` | text | Description of the cited regulation |
| `observation_count` | int | Number of times this citation was issued that year |
| `program_area` | text | Program area (e.g. Bioresearch Monitoring, Drug Manufacturing) |

---

## 8. `openalex_authors`

**Source:** OpenAlex (https://openalex.org)

Author-level bibliometric data from OpenAlex, an open catalog of scholarly works and researchers.

| Field | Type | Description |
|---|---|---|
| `openalex_id` | text | OpenAlex author ID (e.g. A1234567890) |
| `display_name` | text | Author's display name in OpenAlex |
| `orcid` | text | ORCID identifier if available |
| `works_count` | int | Total number of indexed works |
| `cited_by_count` | int | Total citations across all works |
| `h_index` | int | h-index |
| `i10_index` | int | i10-index (works with 10+ citations) |
| `last_known_institution_name` | text | Most recent institution affiliation |
| `last_known_institution_country` | text | Country of most recent institution |
| `concepts` | jsonb | Research concepts with relevance scores |
| `two_year_mean_citedness` | float | Mean citations per work over the last 2 years |
| `resolved_investigator_id` | text | Canonical investigator ID via identity resolution |

---

## 9. `openalex_works`

**Source:** OpenAlex (https://openalex.org)

Individual publication records from OpenAlex, cross-linked with PubMed and DOI where available.

| Field | Type | Description |
|---|---|---|
| `openalex_id` | text | OpenAlex work ID |
| `doi` | text | DOI |
| `pubmed_id` | text | PubMed ID if indexed |
| `title` | text | Publication title |
| `pub_year` | int | Year of publication |
| `journal_name` | text | Journal or venue |
| `cited_by_count` | int | Citation count in OpenAlex |
| `author_openalex_ids` | text[] | OpenAlex IDs of all authors |
| `concepts` | jsonb | Research concept tags with scores |

---

## 10. `ictrp_trials`

**Source:** WHO International Clinical Trials Registry Platform (https://trialsearch.who.int)

Trial records from non-ClinicalTrials.gov registries aggregated by the WHO ICTRP (e.g. EudraCT, ANZCTR, CTRI, ISRCTN).

| Field | Type | Description |
|---|---|---|
| `ictrp_id` | text | ICTRP trial identifier |
| `source_registry` | text | Originating registry (e.g. EudraCT, ANZCTR) |
| `public_title`, `scientific_title` | text | Trial titles |
| `study_type`, `phase`, `overall_status` | text | Study classification |
| `condition`, `intervention` | text | Primary condition and intervention |
| `primary_sponsor` | text | Lead sponsoring organization |
| `countries` | text[] | Countries where trial is conducted |
| `primary_contact_name`, `primary_contact_email` | text | Primary contact at the sponsor |
| `date_registration`, `date_enrolling` | date | Registration and enrollment start dates |
| `target_size` | int | Target enrollment count |
| `resolved_investigator_id` | text | Canonical investigator ID via identity resolution |

---

## 11. `cms_open_payments`

**Source:** CMS Open Payments (Sunshine Act) (https://openpaymentsdata.cms.gov)

Financial transfers of value from pharmaceutical and medical device companies to physicians, as reported under the Physician Payments Sunshine Act.

| Field | Type | Description |
|---|---|---|
| `record_id` | text | CMS unique record identifier |
| `payment_year` | int | Year the payment was made |
| `covered_recipient_type` | text | Physician or Teaching Hospital |
| `physician_npi` | text | NPI of the receiving physician |
| `physician_name_first`, `physician_name_last` | text | Physician name |
| `physician_specialty` | text | Self-reported specialty |
| `recipient_state`, `recipient_country` | text | Recipient location |
| `paying_entity` | text | Company making the payment |
| `nature_of_payment` | text | Category (e.g. Consulting Fee, Speaking, Research) |
| `total_amount` | numeric(12,2) | Dollar amount of the payment |
| `payment_form` | text | Form of the transfer (Cash, Stock, In-kind, etc.) |
| `drug_or_biological_name` | text | Drug or biologic associated with the payment, if any |
| `resolved_investigator_id` | text | Canonical investigator ID via identity resolution |

---

## 12. `identity_resolution_matches`

**Internal table** — tracks how records across source tables were matched to a canonical investigator identity.

| Field | Type | Description |
|---|---|---|
| `investigator_id` | text | Canonical investigator identifier |
| `source_table` | text | Name of the source table the match came from |
| `source_record_id` | text | Primary key of the matched record in the source table |
| `confidence` | float | Match confidence score (0.0–1.0) |
| `match_method` | text | Method used (e.g. exact_name, fuzzy_npi, embedding) |
| `resolved_at` | timestamptz | Timestamp when match was recorded |

---

## 13. `agent_scoring_runs`

**Internal table** — stores LLM-generated investigator quality ratings produced by the scoring agent.

| Field | Type | Description |
|---|---|---|
| `investigator_id` | text | Canonical investigator identifier being scored |
| `rating` | int | Numeric rating assigned by the agent |
| `reason` | text | Agent's natural language justification for the rating |
| `model` | text | Model used to generate the score (e.g. claude-sonnet-4-20250514) |
| `created_at` | timestamptz | Timestamp when the scoring run was recorded |

---

## Cross-Table Relationships

All source tables link to a canonical investigator identity via the `resolved_investigator_id` field. Resolution logic is tracked in `identity_resolution_matches`.

```
clinicaltrials_investigators ──┐
npi_providers ─────────────────┤
fda_bmis ──────────────────────┤──► resolved_investigator_id ──► identity_resolution_matches
fda_483_letters ───────────────┤
openalex_authors ──────────────┤
ictrp_trials ──────────────────┤
cms_open_payments ─────────────┘
                                          │
                                          ▼
                                  agent_scoring_runs
```

PubMed articles link via `resolved_author_ids` (array), and OpenAlex works link to authors via `author_openalex_ids`.
