create table if not exists clinicaltrials_studies (
  id uuid primary key default gen_random_uuid(),
  nct_id text,
  brief_title text,
  official_title text,
  phase text,
  overall_status text,
  sponsor text,
  responsible_party_type text,
  conditions text[],
  interventions text[],
  enrollment_count int,
  enrollment_type text,
  start_date text,
  primary_completion_date text,
  study_type text,
  is_regeneron boolean,
  raw_json jsonb,
  ingested_at timestamptz default now()
);

create table if not exists clinicaltrials_investigators (
  id uuid primary key default gen_random_uuid(),
  nct_id text,
  full_name text,
  role text,
  affiliation text,
  facility_name text,
  city text,
  state text,
  country text,
  zip text,
  email text,
  phone text,
  resolved_investigator_id text,
  ingested_at timestamptz default now()
);

create table if not exists pubmed_articles (
  id uuid primary key default gen_random_uuid(),
  pubmed_id text,
  doi text,
  title text,
  abstract text,
  journal text,
  volume text,
  issue text,
  pub_date text,
  pub_year int,
  authors_raw jsonb,
  mesh_terms text[],
  indication_tags text[],
  citation_count int,
  resolved_author_ids text[],
  ingested_at timestamptz default now()
);

create table if not exists npi_providers (
  id uuid primary key default gen_random_uuid(),
  npi text,
  provider_type text,
  name_last text,
  name_first text,
  name_middle text,
  name_credential text,
  gender text,
  enumeration_date date,
  last_updated date,
  deactivation_date date,
  primary_taxonomy text,
  taxonomy_desc text,
  practice_address_1 text,
  practice_city text,
  practice_state text,
  practice_zip text,
  practice_country text,
  practice_phone text,
  is_oncology boolean,
  resolved_investigator_id text,
  ingested_at timestamptz default now()
);

create table if not exists fda_bmis (
  id uuid primary key default gen_random_uuid(),
  bmis_id text,
  full_name text,
  entity_type text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text,
  zip text,
  country text,
  ind_number text,
  submission_type text,
  sponsor text,
  receipt_date date,
  study_drug text,
  indication text,
  resolved_investigator_id text,
  ingested_at timestamptz default now()
);

create table if not exists fda_483_letters (
  id uuid primary key default gen_random_uuid(),
  subject text,
  company_name text,
  issuing_office text,
  letter_date text,
  letter_url text,
  letter_type text,
  investigator_names_extracted text[],
  observations text[],
  resolved_investigator_ids text[],
  ingested_at timestamptz default now()
);

create table if not exists fda_inspection_observations (
  id uuid primary key default gen_random_uuid(),
  fiscal_year int,
  citation_number text,
  citation_desc text,
  observation_count int,
  program_area text,
  ingested_at timestamptz default now()
);

create table if not exists openalex_authors (
  id uuid primary key default gen_random_uuid(),
  openalex_id text,
  display_name text,
  orcid text,
  works_count int,
  cited_by_count int,
  h_index int,
  i10_index int,
  last_known_institution_name text,
  last_known_institution_country text,
  concepts jsonb,
  two_year_mean_citedness float,
  resolved_investigator_id text,
  ingested_at timestamptz default now()
);

create table if not exists openalex_works (
  id uuid primary key default gen_random_uuid(),
  openalex_id text,
  doi text,
  pubmed_id text,
  title text,
  pub_year int,
  journal_name text,
  cited_by_count int,
  author_openalex_ids text[],
  concepts jsonb,
  ingested_at timestamptz default now()
);

create table if not exists ictrp_trials (
  id uuid primary key default gen_random_uuid(),
  ictrp_id text,
  source_registry text,
  public_title text,
  scientific_title text,
  study_type text,
  phase text,
  overall_status text,
  condition text,
  intervention text,
  primary_sponsor text,
  countries text[],
  primary_contact_name text,
  primary_contact_email text,
  date_registration date,
  date_enrolling date,
  target_size int,
  resolved_investigator_id text,
  ingested_at timestamptz default now()
);

create table if not exists cms_open_payments (
  id uuid primary key default gen_random_uuid(),
  record_id text,
  payment_year int,
  covered_recipient_type text,
  physician_npi text,
  physician_name_first text,
  physician_name_last text,
  physician_specialty text,
  recipient_state text,
  recipient_country text,
  paying_entity text,
  nature_of_payment text,
  total_amount numeric(12,2),
  payment_form text,
  drug_or_biological_name text,
  resolved_investigator_id text,
  ingested_at timestamptz default now()
);

create table if not exists identity_resolution_matches (
  id uuid primary key default gen_random_uuid(),
  investigator_id text,
  source_table text,
  source_record_id text,
  confidence float,
  match_method text,
  resolved_at timestamptz default now()
);

create table if not exists agent_scoring_runs (
  id uuid primary key default gen_random_uuid(),
  investigator_id text,
  rating int,
  reason text,
  model text,
  created_at timestamptz default now()
);
