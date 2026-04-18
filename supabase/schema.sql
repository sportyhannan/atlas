-- Atlas — Supabase schema
-- Run in the Supabase SQL Editor: https://app.supabase.com → SQL Editor

-- Enable pgvector for semantic search
create extension if not exists vector;

-- ── Institutions ────────────────────────────────────────────────────────
create table if not exists institutions (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  city               text,
  country            text,                           -- ISO 3166-1 alpha-2
  type               text,                           -- "Academic Medical Center", "CRO site", etc.
  has_minus_80_freezer boolean,
  ehr_system         text,
  track_record_score int default 0 check (track_record_score between 0 and 100),
  active_trial_count int default 0,
  website            text,
  created_at         timestamptz default now()
);

-- ── Investigators ─────────────────────────────────────────────────────
create table if not exists investigators (
  id                     text primary key,             -- md5 hash of name+site for dedup
  full_name              text not null,
  credentials            text,
  initials               text,
  npi                    text,
  orcid                  text,
  email                  text,
  primary_institution_id uuid references institutions(id),
  city                   text,
  country                text,
  lat                    double precision,
  lng                    double precision,
  indication_tags        text[] default '{}',
  phase_experience       text[] default '{}',
  is_rising_star         boolean default false,
  rare_disease           boolean default false,
  has_483_flag           boolean default false,
  enrollments_total      int default 0,
  active_trial_count     int default 0,
  fit_score              int default 0 check (fit_score between 0 and 100),
  velocity_per_year      int default 0,
  status                 text default 'Responsive',  -- Responsive | Pending | Overbooked | Flagged
  embedding              vector(1536),                -- OpenAI/Anthropic embedding for semantic search
  created_at             timestamptz default now(),
  updated_at             timestamptz default now()
);

create index if not exists investigators_country_idx on investigators(country);
create index if not exists investigators_indication_idx on investigators using gin(indication_tags);
create index if not exists investigators_rising_star_idx on investigators(is_rising_star) where is_rising_star = true;
create index if not exists investigators_embedding_idx on investigators using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- ── Trials ─────────────────────────────────────────────────────────────
create table if not exists trials (
  id                     uuid primary key default gen_random_uuid(),
  nct_id                 text unique not null,
  title                  text not null,
  phase                  text,                        -- "Phase 1", "Phase 2", "Phase 3"
  status                 text,                        -- "Recruiting", "Active, not recruiting", "Completed"
  conditions             text[] default '{}',
  interventions          text[] default '{}',         -- drug names
  sponsor                text,
  is_regeneron           boolean default false,
  start_date             date,
  primary_completion_date date,
  enrollment_target      int,
  enrollment_actual      int,
  registry               text default 'ClinicalTrials.gov',
  created_at             timestamptz default now()
);

create index if not exists trials_nct_id_idx on trials(nct_id);
create index if not exists trials_is_regeneron_idx on trials(is_regeneron) where is_regeneron = true;

-- ── Investigator ↔ Trial ─────────────────────────────────────────────
create table if not exists investigator_trials (
  investigator_id text references investigators(id) on delete cascade,
  trial_id        uuid references trials(id) on delete cascade,
  role            text default 'Sub-I',             -- "PI", "Sub-I"
  start_date      date,
  primary key (investigator_id, trial_id)
);

-- ── Publications ─────────────────────────────────────────────────────
create table if not exists publications (
  id                           uuid primary key default gen_random_uuid(),
  pubmed_id                    text unique,
  doi                          text,
  title                        text,
  year                         int,
  journal                      text,
  first_author_investigator_id text references investigators(id),
  author_investigator_ids      text[] default '{}',
  indication_tags              text[] default '{}',
  citation_count               int default 0,
  created_at                   timestamptz default now()
);

-- ── Regulatory actions (483s, 1572s) ─────────────────────────────────
create table if not exists regulatory_actions (
  id               uuid primary key default gen_random_uuid(),
  action_type      text,                            -- "483 Warning Letter", "Form 1572 Filing"
  investigator_id  text references investigators(id),
  institution_id   uuid references institutions(id),
  date             text,
  summary          text,
  source_url       text,
  created_at       timestamptz default now()
);

-- ── Searches (audit trail) ────────────────────────────────────────────
create table if not exists searches (
  id                    uuid primary key default gen_random_uuid(),
  query_text            text,
  parsed_criteria       jsonb,
  result_count          int,
  rising_star_count     int,
  reasoning_trace       jsonb,
  query_ms              int,
  created_at            timestamptz default now()
);

-- ── Row-level security (public read, service-role write) ─────────────
alter table investigators      enable row level security;
alter table institutions       enable row level security;
alter table trials             enable row level security;
alter table investigator_trials enable row level security;
alter table publications       enable row level security;
alter table regulatory_actions enable row level security;
alter table searches           enable row level security;

-- Public read (anon key can SELECT)
create policy "public read investigators"      on investigators      for select using (true);
create policy "public read institutions"       on institutions       for select using (true);
create policy "public read trials"             on trials             for select using (true);
create policy "public read investigator_trials" on investigator_trials for select using (true);
create policy "public read publications"       on publications       for select using (true);
create policy "public read regulatory_actions" on regulatory_actions for select using (true);
create policy "public read searches"           on searches           for select using (true);

-- Service role can insert/update (ingestion scripts use SUPABASE_SERVICE_ROLE_KEY)
create policy "service insert investigators"   on investigators      for insert with check (true);
create policy "service update investigators"   on investigators      for update using (true);
create policy "service insert institutions"    on institutions       for insert with check (true);
create policy "service insert trials"          on trials             for insert with check (true);
create policy "service insert publications"    on publications       for insert with check (true);
create policy "service insert reg_actions"     on regulatory_actions for insert with check (true);
create policy "service insert searches"        on searches           for insert with check (true);
