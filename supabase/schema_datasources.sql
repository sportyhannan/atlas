-- ============================================================
-- Atlas — Raw data source tables
-- One table per ingested source. Agent framework reads these,
-- runs identity resolution + scoring, writes to investigators.
--
-- Run AFTER schema.sql in Supabase SQL Editor.
-- ============================================================

-- ── 1. ClinicalTrials.gov ───────────────────────────────────
-- Raw study + location records from ClinicalTrials.gov v2 API.
-- Ingested by scripts/ingest_clinicaltrials.py.

create table if not exists raw_clinicaltrials_studies (
  id                  uuid primary key default gen_random_uuid(),
  nct_id              text not null unique,
  brief_title         text,
  official_title      text,
  phase               text,                       -- "Phase 1", "Phase 2", "Phase 3"
  overall_status      text,                       -- "Recruiting", "Completed", etc.
  sponsor             text,
  responsible_party_type text,
  conditions          text[] default '{}',
  interventions       text[] default '{}',
  enrollment_count    int,
  enrollment_type     text,                       -- "Actual" | "Anticipated"
  start_date          text,
  primary_completion_date text,
  study_type          text,                       -- "Interventional" | "Observational"
  is_regeneron        boolean default false,
  raw_json            jsonb,                      -- full API response stored for reprocessing
  ingested_at         timestamptz default now()
);

create index if not exists raw_ct_nct_id_idx on raw_clinicaltrials_studies(nct_id);
create index if not exists raw_ct_status_idx on raw_clinicaltrials_studies(overall_status);
create index if not exists raw_ct_phase_idx  on raw_clinicaltrials_studies(phase);

-- Investigator/contact records extracted from trial location fields
create table if not exists raw_clinicaltrials_investigators (
  id                  uuid primary key default gen_random_uuid(),
  nct_id              text references raw_clinicaltrials_studies(nct_id) on delete cascade,
  full_name           text not null,
  role                text,                       -- "PRINCIPAL_INVESTIGATOR" | "CONTACT" | "RESPONSIBLE_PARTY_INVESTIGATOR"
  affiliation         text,
  facility_name       text,
  city                text,
  state               text,
  country             text,                       -- ISO 3166-1 alpha-2
  zip                 text,
  email               text,
  phone               text,
  resolved_investigator_id text,                  -- FK to investigators.id after identity resolution
  ingested_at         timestamptz default now()
);

create index if not exists raw_ct_inv_name_idx    on raw_clinicaltrials_investigators(full_name);
create index if not exists raw_ct_inv_country_idx on raw_clinicaltrials_investigators(country);
create index if not exists raw_ct_inv_nct_idx     on raw_clinicaltrials_investigators(nct_id);

-- ── 2. PubMed / NCBI E-utilities ───────────────────────────
-- Publications pulled via NCBI esearch + esummary.
-- Ingested by scripts/ingest_clinicaltrials.py (enrichment step).

create table if not exists raw_pubmed_articles (
  id                  uuid primary key default gen_random_uuid(),
  pubmed_id           text not null unique,
  doi                 text,
  title               text,
  abstract            text,
  journal             text,
  volume              text,
  issue               text,
  pub_date            text,                       -- "2024 Mar 15" — raw string from API
  pub_year            int,
  authors_raw         jsonb,                      -- [{name, affiliation, orcid}]
  mesh_terms          text[] default '{}',
  indication_tags     text[] default '{}',        -- extracted by agent from title/abstract/MeSH
  citation_count      int default 0,
  resolved_author_ids text[] default '{}',        -- FKs to investigators.id after resolution
  ingested_at         timestamptz default now()
);

create index if not exists raw_pm_pubmed_id_idx on raw_pubmed_articles(pubmed_id);
create index if not exists raw_pm_year_idx      on raw_pubmed_articles(pub_year);
create index if not exists raw_pm_tags_idx      on raw_pubmed_articles using gin(indication_tags);

-- ── 3. NPI Registry (NPPES) ────────────────────────────────
-- US National Provider Identifier records.
-- Source: https://download.cms.gov/nppes/NPI_Files.html (monthly CSV dump)
-- Used for: US investigator identity verification, specialty, address freshness.

create table if not exists raw_npi_providers (
  id                  uuid primary key default gen_random_uuid(),
  npi                 text not null unique,
  provider_type       text,                       -- "1" = individual, "2" = organization
  name_last           text,
  name_first          text,
  name_middle         text,
  name_credential     text,                       -- "MD", "PhD", etc.
  gender              text,
  enumeration_date    date,
  last_updated        date,
  deactivation_date   date,                       -- null = still active
  primary_taxonomy    text,                       -- NUCC taxonomy code
  taxonomy_desc       text,                       -- "Internal Medicine", "Hematology", etc.
  practice_address_1  text,
  practice_city       text,
  practice_state      text,
  practice_zip        text,
  practice_country    text,
  practice_phone      text,
  is_oncology         boolean default false,      -- taxonomy starts with 207R or 207P
  resolved_investigator_id text,
  ingested_at         timestamptz default now()
);

create index if not exists raw_npi_npi_idx      on raw_npi_providers(npi);
create index if not exists raw_npi_name_idx     on raw_npi_providers(name_last, name_first);
create index if not exists raw_npi_oncology_idx on raw_npi_providers(is_oncology) where is_oncology = true;

-- ── 4. FDA BMIS (Bioresearch Monitoring Information System) ─
-- Investigators/CROs/IRBs from Form 1572/1571 submissions.
-- Source: https://www.fda.gov/drugs/drug-approvals-and-databases/bioresearch-monitoring-information-system-bmis
-- Downloadable ZIP → CSV/Excel. Updated quarterly.

create table if not exists raw_fda_bmis (
  id                  uuid primary key default gen_random_uuid(),
  bmis_id             text,                       -- FDA internal record ID if present
  full_name           text not null,
  entity_type         text,                       -- "Clinical Investigator" | "IRB" | "CRO"
  address_line_1      text,
  address_line_2      text,
  city                text,
  state               text,
  zip                 text,
  country             text,
  ind_number          text,                       -- Investigational New Drug application number
  submission_type     text,                       -- "1572" | "1571" | "3674"
  sponsor             text,
  receipt_date        date,
  study_drug          text,
  indication          text,
  resolved_investigator_id text,
  ingested_at         timestamptz default now()
);

create index if not exists raw_bmis_name_idx    on raw_fda_bmis(full_name);
create index if not exists raw_bmis_country_idx on raw_fda_bmis(country);
create index if not exists raw_bmis_ind_idx     on raw_fda_bmis(ind_number);

-- ── 5. FDA 483 Warning Letters / Inspection Observations ───
-- Negative compliance signal. Sources:
--   Warning letters: https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/compliance-actions-and-activities/warning-letters
--   Inspection observations: https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-references/inspection-observations
-- Ingested by scripts/ingest_fda_483.py

create table if not exists raw_fda_483_letters (
  id                  uuid primary key default gen_random_uuid(),
  subject             text,
  company_name        text,                       -- often the investigator's institution
  issuing_office      text,                       -- "Center for Drug Evaluation and Research", etc.
  letter_date         text,
  letter_url          text,
  letter_type         text default '483 Warning Letter',
  investigator_names_extracted text[] default '{}', -- regex-extracted names from subject
  observations        text[] default '{}',        -- extracted observation categories
  resolved_investigator_ids text[] default '{}',
  ingested_at         timestamptz default now()
);

create index if not exists raw_483_date_idx on raw_fda_483_letters(letter_date);

-- Individual inspection observations (more granular than the letter itself)
create table if not exists raw_fda_inspection_observations (
  id                  uuid primary key default gen_random_uuid(),
  fiscal_year         int,
  citation_number     text,                       -- e.g. "21 CFR 312.62(b)"
  citation_desc       text,
  observation_count   int default 0,
  program_area        text,                       -- "Bioresearch Monitoring", "Drug Manufacturing"
  ingested_at         timestamptz default now()
);

-- ── 6. OpenAlex ────────────────────────────────────────────
-- Disambiguated authors, institutions, works, topics.
-- Source: https://openalex.org — free API + full data snapshot.
-- Complements PubMed with better author disambiguation.

create table if not exists raw_openalex_authors (
  id                  uuid primary key default gen_random_uuid(),
  openalex_id         text not null unique,       -- e.g. "A5023888391"
  display_name        text,
  orcid               text,
  works_count         int default 0,
  cited_by_count      int default 0,
  h_index             int,
  i10_index           int,
  last_known_institution_name text,
  last_known_institution_country text,
  concepts            jsonb,                      -- [{concept, score}] — disease areas
  two_year_mean_citedness float,
  resolved_investigator_id text,
  ingested_at         timestamptz default now()
);

create index if not exists raw_oa_openalex_id_idx on raw_openalex_authors(openalex_id);
create index if not exists raw_oa_orcid_idx       on raw_openalex_authors(orcid);
create index if not exists raw_oa_name_idx        on raw_openalex_authors(display_name);

-- Works (publications) from OpenAlex
create table if not exists raw_openalex_works (
  id                  uuid primary key default gen_random_uuid(),
  openalex_id         text not null unique,
  doi                 text,
  pubmed_id           text,
  title               text,
  pub_year            int,
  journal_name        text,
  cited_by_count      int default 0,
  author_openalex_ids text[] default '{}',
  concepts            jsonb,
  ingested_at         timestamptz default now()
);

create index if not exists raw_oa_works_pubmed_idx on raw_openalex_works(pubmed_id);

-- ── 7. WHO ICTRP ────────────────────────────────────────────
-- International Clinical Trials Registry Platform.
-- Source: https://trialsearch.who.int — weekly XML/CSV download.
-- Covers: EUCTR, ISRCTN, ChiCTR, ANZCTR, JPRN, and 13 more.
-- Note: Terms of use restrict commercial redistribution.

create table if not exists raw_who_ictrp_trials (
  id                  uuid primary key default gen_random_uuid(),
  ictrp_id            text not null unique,       -- e.g. "EUCTR2021-001234-12"
  source_registry     text,                       -- "EUCTR", "ISRCTN", "ChiCTR", "ANZCTR", etc.
  public_title        text,
  scientific_title    text,
  study_type          text,
  phase               text,
  overall_status      text,
  condition           text,
  intervention        text,
  primary_sponsor     text,
  countries           text[] default '{}',
  primary_contact_name text,
  primary_contact_email text,
  date_registration   date,
  date_enrolling      date,
  target_size         int,
  resolved_investigator_id text,
  ingested_at         timestamptz default now()
);

create index if not exists raw_ictrp_id_idx       on raw_who_ictrp_trials(ictrp_id);
create index if not exists raw_ictrp_registry_idx on raw_who_ictrp_trials(source_registry);
create index if not exists raw_ictrp_country_idx  on raw_who_ictrp_trials using gin(countries);

-- ── 8. CMS Open Payments ────────────────────────────────────
-- Research + general payments from companies to physicians/hospitals.
-- Source: https://openpaymentsdata.cms.gov — annual CSV downloads.
-- Signal: "industry-connected researcher" for scoring.

create table if not exists raw_cms_open_payments (
  id                  uuid primary key default gen_random_uuid(),
  record_id           text unique,
  payment_year        int,
  covered_recipient_type text,                    -- "Covered Recipient Physician"
  physician_npi       text,
  physician_name_first text,
  physician_name_last  text,
  physician_specialty  text,
  recipient_state     text,
  recipient_country   text default 'US',
  paying_entity       text,                       -- pharma company name
  nature_of_payment   text,                       -- "Research", "Consulting Fee", etc.
  total_amount        numeric(12,2),
  payment_form        text,                       -- "Cash or cash equivalent"
  drug_or_biological_name text,
  resolved_investigator_id text,
  ingested_at         timestamptz default now()
);

create index if not exists raw_op_npi_idx  on raw_cms_open_payments(physician_npi);
create index if not exists raw_op_year_idx on raw_cms_open_payments(payment_year);
create index if not exists raw_op_entity_idx on raw_cms_open_payments(paying_entity);

-- ── 9. Identity resolution log ──────────────────────────────
-- Records every cross-source match the agent makes.
-- Agent writes here; UI can show "sourced from X registries".

create table if not exists identity_resolution_matches (
  id                  uuid primary key default gen_random_uuid(),
  investigator_id     text references investigators(id) on delete cascade,
  source_table        text not null,              -- e.g. "raw_clinicaltrials_investigators"
  source_record_id    text not null,              -- UUID of the source row
  confidence          float,                      -- 0.0–1.0
  match_method        text,                       -- "npi_exact" | "embedding_cosine" | "name_fuzzy"
  resolved_at         timestamptz default now()
);

create index if not exists idres_inv_idx    on identity_resolution_matches(investigator_id);
create index if not exists idres_source_idx on identity_resolution_matches(source_table, source_record_id);

-- ── 10. Agent scoring runs ──────────────────────────────────
-- Agent writes one row per (search, investigator) pair.
-- UI reads this to display the score breakdown + reasoning.

create table if not exists agent_scoring_runs (
  id                  uuid primary key default gen_random_uuid(),
  search_id           uuid references searches(id) on delete cascade,
  investigator_id     text references investigators(id) on delete cascade,
  fit_score           int check (fit_score between 0 and 100),
  score_breakdown     jsonb,                      -- {indicationMatch, phaseExperience, ...}
  sources_used        text[] default '{}',        -- which raw tables contributed
  citations           jsonb,                      -- [{source, id, url, quote}]
  reasoning_trace     jsonb,                      -- agent's step-by-step chain-of-thought
  model               text,                       -- "K2 Think V2" | "claude-sonnet-4-6"
  latency_ms          int,
  created_at          timestamptz default now()
);

create index if not exists scoring_search_idx on agent_scoring_runs(search_id);
create index if not exists scoring_inv_idx    on agent_scoring_runs(investigator_id);

-- ── RLS policies for new tables ─────────────────────────────

alter table raw_clinicaltrials_studies             enable row level security;
alter table raw_clinicaltrials_investigators       enable row level security;
alter table raw_pubmed_articles                    enable row level security;
alter table raw_npi_providers                      enable row level security;
alter table raw_fda_bmis                           enable row level security;
alter table raw_fda_483_letters                    enable row level security;
alter table raw_fda_inspection_observations        enable row level security;
alter table raw_openalex_authors                   enable row level security;
alter table raw_openalex_works                     enable row level security;
alter table raw_who_ictrp_trials                   enable row level security;
alter table raw_cms_open_payments                  enable row level security;
alter table identity_resolution_matches            enable row level security;
alter table agent_scoring_runs                     enable row level security;

-- Public read (anon key can SELECT — agent framework needs this)
create policy "public read raw_ct_studies"        on raw_clinicaltrials_studies             for select using (true);
create policy "public read raw_ct_investigators"  on raw_clinicaltrials_investigators       for select using (true);
create policy "public read raw_pubmed"            on raw_pubmed_articles                    for select using (true);
create policy "public read raw_npi"               on raw_npi_providers                     for select using (true);
create policy "public read raw_bmis"              on raw_fda_bmis                           for select using (true);
create policy "public read raw_483"               on raw_fda_483_letters                    for select using (true);
create policy "public read raw_483_obs"           on raw_fda_inspection_observations        for select using (true);
create policy "public read raw_openalex_authors"  on raw_openalex_authors                   for select using (true);
create policy "public read raw_openalex_works"    on raw_openalex_works                     for select using (true);
create policy "public read raw_ictrp"             on raw_who_ictrp_trials                   for select using (true);
create policy "public read raw_open_payments"     on raw_cms_open_payments                  for select using (true);
create policy "public read identity_resolution"   on identity_resolution_matches            for select using (true);
create policy "public read agent_scoring"         on agent_scoring_runs                     for select using (true);

-- Service role insert (ingestion scripts + agent framework write here)
create policy "service insert raw_ct_studies"      on raw_clinicaltrials_studies             for insert with check (true);
create policy "service insert raw_ct_investigators" on raw_clinicaltrials_investigators      for insert with check (true);
create policy "service insert raw_pubmed"          on raw_pubmed_articles                    for insert with check (true);
create policy "service insert raw_npi"             on raw_npi_providers                     for insert with check (true);
create policy "service insert raw_bmis"            on raw_fda_bmis                           for insert with check (true);
create policy "service insert raw_483"             on raw_fda_483_letters                    for insert with check (true);
create policy "service insert raw_openalex_authors" on raw_openalex_authors                  for insert with check (true);
create policy "service insert raw_openalex_works"  on raw_openalex_works                     for insert with check (true);
create policy "service insert raw_ictrp"           on raw_who_ictrp_trials                   for insert with check (true);
create policy "service insert raw_open_payments"   on raw_cms_open_payments                  for insert with check (true);
create policy "service insert identity_resolution" on identity_resolution_matches            for insert with check (true);
create policy "service update identity_resolution" on identity_resolution_matches            for update using (true);
create policy "service insert agent_scoring"       on agent_scoring_runs                     for insert with check (true);
create policy "service update agent_scoring"       on agent_scoring_runs                     for update using (true);
