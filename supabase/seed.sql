-- ── investigators (adds two; Amelia assumed pre-existing) ─────────────────
insert into investigators (
  id, name, site_name, site_location, focus,
  enrollments, velocity_per_year, status, fit_score,
  score_trajectory, score_comparison, score_institutional, score_capacity
) values
  ('c3456789-aaaa-bbbb-cccc-ddddeeeeffff',
   'Dr. James Whitfield', 'MD Anderson Cancer Center', 'Houston, TX, US',
   array['Phase 2', 'Oncology'],
   82, 17, 'pending', 74,
   78, 70, 88, 62),
  ('d7777777-eeee-ffff-aaaa-111122223333',
   'Dr. Sofia Costa', 'Champalimaud Foundation', 'Lisbon, PT',
   array['Phase 1', 'Rare Disease'],
   41, 11, 'responsive', 69,
   82, 58, 71, 66);

-- ── clinicaltrials_studies ────────────────────────────────────────────────
insert into clinicaltrials_studies (
  nct_id, brief_title, official_title, phase, overall_status, sponsor,
  responsible_party_type, conditions, interventions, enrollment_count,
  enrollment_type, start_date, primary_completion_date, study_type,
  is_regeneron, raw_json
) values
  ('NCT05001234',
   'Pembro + Chemo in Advanced NSCLC (APAC)',
   'A Phase 3 Multicenter Study of Pembrolizumab Plus Platinum-Doublet in Stage IV NSCLC',
   'Phase 3', 'Recruiting', 'Merck Sharp & Dohme',
   'Sponsor', array['NSCLC','Lung Cancer'], array['Pembrolizumab','Carboplatin'],
   420, 'Anticipated', '2023-09-01', '2026-03-01', 'Interventional',
   false, '{"lead_sponsor":"MSD","locations":["Samsung Medical Center","MD Anderson"]}'::jsonb),
  ('NCT05009999',
   'Osimertinib Maintenance in EGFR+ NSCLC',
   'A Randomized Phase 2 Study of Osimertinib Maintenance After Chemoradiation',
   'Phase 2', 'Active, not recruiting', 'AstraZeneca',
   'Sponsor', array['NSCLC','EGFR mutation'], array['Osimertinib'],
   160, 'Actual', '2022-04-15', '2025-11-30', 'Interventional',
   false, '{"lead_sponsor":"AZ"}'::jsonb),
  ('NCT05100200',
   'CAR-T in Relapsed DLBCL',
   'Phase 2 Open-Label Study of Next-Gen CAR-T in r/r DLBCL',
   'Phase 2', 'Recruiting', 'Regeneron Pharmaceuticals',
   'Sponsor', array['DLBCL','Lymphoma'], array['Investigational CAR-T'],
   90, 'Anticipated', '2024-01-10', '2027-06-01', 'Interventional',
   true, '{"lead_sponsor":"Regeneron"}'::jsonb);

-- ── clinicaltrials_investigators (cross-link via nct_id + resolved_investigator_id)
insert into clinicaltrials_investigators (
  nct_id, full_name, role, affiliation, facility_name,
  city, state, country, zip, email, phone, resolved_investigator_id
) values
  ('NCT05001234', 'Dr. Amelia Park', 'PRINCIPAL_INVESTIGATOR',
   'Samsung Medical Center', 'Samsung Medical Center',
   'Seoul', null, 'KR', '06351', 'amelia.park@samsung.example', '+82-2-3410-0000',
   'b452bdf6-32ab-45f9-b696-c6927849e735'),
  ('NCT05009999', 'Dr. Amelia Park', 'PRINCIPAL_INVESTIGATOR',
   'Samsung Medical Center', 'Samsung Medical Center',
   'Seoul', null, 'KR', '06351', 'amelia.park@samsung.example', '+82-2-3410-0000',
   'b452bdf6-32ab-45f9-b696-c6927849e735'),
  ('NCT05100200', 'Dr. James Whitfield', 'PRINCIPAL_INVESTIGATOR',
   'MD Anderson Cancer Center', 'MD Anderson Cancer Center',
   'Houston', 'TX', 'US', '77030', 'jwhitfield@mdanderson.example', '+1-713-555-0100',
   'c3456789-aaaa-bbbb-cccc-ddddeeeeffff'),
  ('NCT05001234', 'Dr. James Whitfield', 'CONTACT',
   'MD Anderson Cancer Center', 'MD Anderson Cancer Center',
   'Houston', 'TX', 'US', '77030', 'jwhitfield@mdanderson.example', '+1-713-555-0100',
   'c3456789-aaaa-bbbb-cccc-ddddeeeeffff');

-- ── ictrp_trials (non-US coverage; cross-registers NCT05001234) ───────────
insert into ictrp_trials (
  ictrp_id, source_registry, public_title, scientific_title, study_type,
  phase, overall_status, condition, intervention, primary_sponsor,
  countries, primary_contact_name, primary_contact_email,
  date_registration, date_enrolling, target_size, resolved_investigator_id
) values
  ('EUCTR2023-001234-01', 'EUCTR',
   'Pembro + Chemo in Advanced NSCLC (EU cross-registration of NCT05001234)',
   'A Phase 3 Multicenter Study of Pembrolizumab Plus Platinum-Doublet in Stage IV NSCLC',
   'Interventional', 'Phase 3', 'Recruiting',
   'NSCLC', 'Pembrolizumab + Carboplatin', 'Merck Sharp & Dohme',
   array['KR','PT','DE','FR'], 'Dr. Amelia Park', 'amelia.park@samsung.example',
   '2023-08-01', '2023-09-15', 420,
   'b452bdf6-32ab-45f9-b696-c6927849e735'),
  ('EUCTR2023-009876-02', 'EUCTR',
   'Gene Therapy in Rare Retinal Dystrophy',
   'Phase 1 First-in-Human Study of RPE65-Targeted Gene Therapy',
   'Interventional', 'Phase 1', 'Recruiting',
   'Leber Congenital Amaurosis', 'AAV-RPE65', 'Champalimaud Foundation',
   array['PT','ES','IT'], 'Dr. Sofia Costa', 'sofia.costa@champ.example',
   '2023-11-05', '2024-01-20', 24,
   'd7777777-eeee-ffff-aaaa-111122223333');

-- ── openalex_authors (disambiguated authors) ──────────────────────────────
insert into openalex_authors (
  openalex_id, display_name, orcid, works_count, cited_by_count, h_index, i10_index,
  last_known_institution_name, last_known_institution_country,
  concepts, two_year_mean_citedness, resolved_investigator_id
) values
  ('A5023888391', 'Amelia Park', '0000-0001-1111-2222',
   78, 4120, 34, 55, 'Samsung Medical Center', 'KR',
   '[{"concept":"Non-small cell lung cancer","score":0.93},{"concept":"Immunotherapy","score":0.78}]'::jsonb,
   6.4, 'b452bdf6-32ab-45f9-b696-c6927849e735'),
  ('A5011223344', 'James Whitfield', '0000-0002-5555-6666',
   52, 2890, 28, 41, 'MD Anderson Cancer Center', 'US',
   '[{"concept":"DLBCL","score":0.88},{"concept":"CAR-T therapy","score":0.82}]'::jsonb,
   5.1, 'c3456789-aaaa-bbbb-cccc-ddddeeeeffff'),
  ('A5099887766', 'Sofia Costa', '0000-0002-3333-4444',
   29, 980, 18, 24, 'Champalimaud Foundation', 'PT',
   '[{"concept":"Gene therapy","score":0.91},{"concept":"Retinal dystrophy","score":0.85}]'::jsonb,
   3.7, 'd7777777-eeee-ffff-aaaa-111122223333');

-- ── pubmed_articles (linked to authors via pubmed_id) ─────────────────────
insert into pubmed_articles (
  pubmed_id, doi, title, abstract, journal, volume, issue, pub_date, pub_year,
  authors_raw, mesh_terms, indication_tags, citation_count, resolved_author_ids
) values
  ('38100001', '10.1016/jpark.2024.001',
   'Pembrolizumab plus chemotherapy in EGFR-wildtype NSCLC: updated Phase 3 results',
   'Updated analysis from the KEYNOTE-APAC cohort shows sustained OS benefit...',
   'The Lancet Oncology', '25', '3', '2024 Mar 15', 2024,
   '[{"name":"Park A","affiliation":"Samsung Medical Center","orcid":"0000-0001-1111-2222"}]'::jsonb,
   array['Lung Neoplasms','Immunotherapy'], array['NSCLC','immunotherapy'],
   142, array['b452bdf6-32ab-45f9-b696-c6927849e735']),
  ('38200001', '10.1200/JCO.2024.200',
   'Next-generation CAR-T in relapsed DLBCL: safety run-in',
   'We report safety from the first 12 patients treated on NCT05100200...',
   'Journal of Clinical Oncology', '42', '7', '2024 Feb 20', 2024,
   '[{"name":"Whitfield J","affiliation":"MD Anderson","orcid":"0000-0002-5555-6666"}]'::jsonb,
   array['Lymphoma, Large B-Cell, Diffuse','Immunotherapy, Adoptive'], array['DLBCL','CAR-T'],
   88, array['c3456789-aaaa-bbbb-cccc-ddddeeeeffff']),
  ('38300001', '10.1056/NEJM.2024.300',
   'AAV-RPE65 gene therapy for Leber congenital amaurosis: 12-month outcomes',
   'Twelve-month visual acuity and safety outcomes from a Phase 1 gene therapy trial...',
   'New England Journal of Medicine', '390', '18', '2024 May 02', 2024,
   '[{"name":"Costa S","affiliation":"Champalimaud Foundation","orcid":"0000-0002-3333-4444"}]'::jsonb,
   array['Leber Congenital Amaurosis','Genetic Therapy'], array['gene therapy','retinal dystrophy'],
   61, array['d7777777-eeee-ffff-aaaa-111122223333']);

-- ── openalex_works (ties openalex_id to authors, mirrors pubmed rows) ─────
insert into openalex_works (
  openalex_id, doi, pubmed_id, title, pub_year, journal_name,
  cited_by_count, author_openalex_ids, concepts
) values
  ('W4380001111', '10.1016/jpark.2024.001', '38100001',
   'Pembrolizumab plus chemotherapy in EGFR-wildtype NSCLC: updated Phase 3 results',
   2024, 'The Lancet Oncology', 142,
   array['A5023888391'],
   '[{"concept":"NSCLC"},{"concept":"Pembrolizumab"}]'::jsonb),
  ('W4380002222', '10.1200/JCO.2024.200', '38200001',
   'Next-generation CAR-T in relapsed DLBCL: safety run-in',
   2024, 'Journal of Clinical Oncology', 88,
   array['A5011223344'],
   '[{"concept":"DLBCL"},{"concept":"CAR-T"}]'::jsonb),
  ('W4380003333', '10.1056/NEJM.2024.300', '38300001',
   'AAV-RPE65 gene therapy for Leber congenital amaurosis: 12-month outcomes',
   2024, 'New England Journal of Medicine', 61,
   array['A5099887766'],
   '[{"concept":"Gene therapy"},{"concept":"Retinal dystrophy"}]'::jsonb);

-- ── npi_providers (US only → Whitfield) ───────────────────────────────────
insert into npi_providers (
  npi, provider_type, name_last, name_first, name_middle, name_credential,
  gender, enumeration_date, last_updated, deactivation_date,
  primary_taxonomy, taxonomy_desc,
  practice_address_1, practice_city, practice_state, practice_zip, practice_country,
  practice_phone, is_oncology, resolved_investigator_id
) values
  ('1234567890', '1', 'Whitfield', 'James', 'A', 'MD',
   'M', '2010-06-14', '2024-01-11', null,
   '207RH0000X', 'Hematology & Oncology',
   '1515 Holcombe Blvd', 'Houston', 'TX', '77030', 'US',
   '+1-713-555-0100', true, 'c3456789-aaaa-bbbb-cccc-ddddeeeeffff');

-- ── fda_bmis (US IND/1572 → Whitfield) ────────────────────────────────────
insert into fda_bmis (
  bmis_id, full_name, entity_type,
  address_line_1, address_line_2, city, state, zip, country,
  ind_number, submission_type, sponsor, receipt_date,
  study_drug, indication, resolved_investigator_id
) values
  ('BMIS-2024-07712', 'Whitfield, James A', 'Clinical Investigator',
   '1515 Holcombe Blvd', null, 'Houston', 'TX', '77030', 'US',
   'IND-152340', '1572', 'Regeneron Pharmaceuticals', '2024-01-05',
   'Investigational CAR-T', 'Relapsed/refractory DLBCL',
   'c3456789-aaaa-bbbb-cccc-ddddeeeeffff');

-- ── fda_483_letters (negative signal → Whitfield) ─────────────────────────
insert into fda_483_letters (
  subject, company_name, issuing_office, letter_date, letter_url, letter_type,
  investigator_names_extracted, observations, resolved_investigator_ids
) values
  ('Clinical Investigator — MD Anderson Cancer Center',
   'MD Anderson Cancer Center',
   'Center for Drug Evaluation and Research',
   '2022-08-18',
   'https://www.fda.gov/example/483/mdanderson-2022.pdf',
   '483 Warning Letter',
   array['James Whitfield'],
   array['Failure to ensure proper monitoring','Inadequate subject records'],
   array['c3456789-aaaa-bbbb-cccc-ddddeeeeffff']);

-- ── fda_inspection_observations (aggregate — not per-investigator) ────────
insert into fda_inspection_observations (
  fiscal_year, citation_number, citation_desc, observation_count, program_area
) values
  (2022, '21 CFR 312.62(b)',
   'Investigator failed to maintain adequate case histories',
   184, 'Bioresearch Monitoring'),
  (2023, '21 CFR 312.60',
   'Failure to conduct investigation in accordance with signed agreement',
   127, 'Bioresearch Monitoring');

-- ── cms_open_payments (US industry payments → Whitfield via NPI) ──────────
insert into cms_open_payments (
  record_id, payment_year, covered_recipient_type,
  physician_npi, physician_name_first, physician_name_last, physician_specialty,
  recipient_state, recipient_country, paying_entity, nature_of_payment,
  total_amount, payment_form, drug_or_biological_name, resolved_investigator_id
) values
  ('OP-2023-00991001', 2023, 'Covered Recipient Physician',
   '1234567890', 'James', 'Whitfield', 'Hematology & Oncology',
   'TX', 'US', 'Regeneron Pharmaceuticals', 'Research',
   84500.00, 'Cash or cash equivalent', 'Investigational CAR-T',
   'c3456789-aaaa-bbbb-cccc-ddddeeeeffff'),
  ('OP-2023-00991002', 2023, 'Covered Recipient Physician',
   '1234567890', 'James', 'Whitfield', 'Hematology & Oncology',
   'TX', 'US', 'Merck Sharp & Dohme', 'Consulting Fee',
   12000.00, 'Cash or cash equivalent', 'Pembrolizumab',
   'c3456789-aaaa-bbbb-cccc-ddddeeeeffff');

-- ── identity_resolution_matches (one row per source→investigator link) ────
insert into identity_resolution_matches (
  investigator_id, source_table, source_record_id, confidence, match_method
) values
  ('b452bdf6-32ab-45f9-b696-c6927849e735', 'clinicaltrials_investigators', 'NCT05001234:Park', 0.98, 'name_exact+affiliation'),
  ('b452bdf6-32ab-45f9-b696-c6927849e735', 'clinicaltrials_investigators', 'NCT05009999:Park', 0.97, 'name_exact+affiliation'),
  ('b452bdf6-32ab-45f9-b696-c6927849e735', 'openalex_authors',             'A5023888391',      0.99, 'orcid_exact'),
  ('b452bdf6-32ab-45f9-b696-c6927849e735', 'pubmed_articles',              '38100001',         0.96, 'orcid_exact'),
  ('b452bdf6-32ab-45f9-b696-c6927849e735', 'ictrp_trials',                 'EUCTR2023-001234-01', 0.92, 'name_fuzzy+affiliation'),

  ('c3456789-aaaa-bbbb-cccc-ddddeeeeffff', 'clinicaltrials_investigators', 'NCT05100200:Whitfield', 0.99, 'npi_exact'),
  ('c3456789-aaaa-bbbb-cccc-ddddeeeeffff', 'clinicaltrials_investigators', 'NCT05001234:Whitfield-contact', 0.94, 'npi_exact'),
  ('c3456789-aaaa-bbbb-cccc-ddddeeeeffff', 'npi_providers',                '1234567890',      1.00, 'npi_exact'),
  ('c3456789-aaaa-bbbb-cccc-ddddeeeeffff', 'fda_bmis',                     'BMIS-2024-07712', 0.95, 'name_exact+ind'),
  ('c3456789-aaaa-bbbb-cccc-ddddeeeeffff', 'fda_483_letters',              'mdanderson-2022', 0.88, 'name_fuzzy+institution'),
  ('c3456789-aaaa-bbbb-cccc-ddddeeeeffff', 'cms_open_payments',            'OP-2023-00991001', 1.00, 'npi_exact'),
  ('c3456789-aaaa-bbbb-cccc-ddddeeeeffff', 'cms_open_payments',            'OP-2023-00991002', 1.00, 'npi_exact'),
  ('c3456789-aaaa-bbbb-cccc-ddddeeeeffff', 'openalex_authors',             'A5011223344',      0.99, 'orcid_exact'),
  ('c3456789-aaaa-bbbb-cccc-ddddeeeeffff', 'pubmed_articles',              '38200001',         0.96, 'orcid_exact'),

  ('d7777777-eeee-ffff-aaaa-111122223333', 'ictrp_trials',                 'EUCTR2023-009876-02', 0.97, 'name_exact+affiliation'),
  ('d7777777-eeee-ffff-aaaa-111122223333', 'openalex_authors',             'A5099887766',      0.99, 'orcid_exact'),
  ('d7777777-eeee-ffff-aaaa-111122223333', 'pubmed_articles',              '38300001',         0.96, 'orcid_exact');

-- ── agent_scoring_runs (one prior rating per investigator) ────────────────
insert into agent_scoring_runs (
  investigator_id, rating, reason, model
) values
  ('b452bdf6-32ab-45f9-b696-c6927849e735', 95,
   'High fit_score with strong score_trajectory.', 'gpt-4o-mini'),
  ('c3456789-aaaa-bbbb-cccc-ddddeeeeffff', 72,
   'Solid enrollment_velocity but pending status and one 483 letter drag on institutional signal.', 'gpt-4o-mini'),
  ('d7777777-eeee-ffff-aaaa-111122223333', 68,
   'Strong score_trajectory in a niche Phase 1 indication; low enrollments reflect rare-disease cohort size.', 'gpt-4o-mini');
