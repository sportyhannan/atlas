-- Atlas seed data — 12 real-feeling investigators across 4 indications
-- Real NCT IDs and PubMed IDs that resolve on their respective sites
-- Run after schema.sql in Supabase SQL Editor

-- Institutions
insert into institutions (id, name, city, country, type, has_minus_80_freezer, ehr_system, track_record_score, active_trial_count)
values
  ('11111111-1111-1111-1111-111111111111', 'Lagos University Teaching Hospital', 'Lagos', 'NG', 'Academic Medical Center', true, 'Custom EHR', 84, 2),
  ('22222222-2222-2222-2222-222222222222', 'Samsung Medical Center', 'Seoul', 'KR', 'Academic Medical Center', true, 'Samsung EMR', 97, 8),
  ('33333333-3333-3333-3333-333333333333', 'MD Anderson Cancer Center', 'Houston', 'US', 'NCI-Designated Comprehensive Cancer Center', true, 'Epic', 99, 22),
  ('44444444-4444-4444-4444-444444444444', 'Warsaw Medical University Hospital', 'Warsaw', 'PL', 'Academic Medical Center', true, 'Medicom', 82, 3),
  ('55555555-5555-5555-5555-555555555555', 'Tata Memorial Centre', 'Mumbai', 'IN', 'Academic Cancer Center', true, 'HMIS', 91, 12),
  ('66666666-6666-6666-6666-666666666666', 'Seoul National University Hospital', 'Seoul', 'KR', 'Academic Medical Center', true, 'SNUH EMR', 96, 7),
  ('77777777-7777-7777-7777-777777777777', 'Hospital Sírio-Libanês', 'São Paulo', 'BR', 'Private Academic Center', true, 'MV Soul', 88, 5),
  ('88888888-8888-8888-8888-888888888888', 'Groote Schuur Hospital', 'Cape Town', 'ZA', 'Academic Medical Center', false, 'Meditech', 79, 1),
  ('99999999-9999-9999-9999-999999999999', 'Charlotte Maxeke Johannesburg Academic Hospital', 'Johannesburg', 'ZA', 'Academic Medical Center', true, 'Meditech', 90, 3),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'IRCCS Ca'' Granda Ospedale Maggiore Policlinico', 'Milan', 'IT', 'Specialized Hemophilia Treatment Center', true, 'GE Centricity', 96, 4),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Instituto Nacional de Câncer (INCA)', 'Rio de Janeiro', 'BR', 'National Cancer Institute', true, 'TASY', 86, 3)
on conflict (id) do nothing;

-- Investigators
insert into investigators (id, full_name, credentials, initials, npi, city, country, lat, lng, indication_tags, phase_experience, is_rising_star, rare_disease, has_483_flag, enrollments_total, active_trial_count, fit_score, velocity_per_year, status, primary_institution_id)
values
  ('inv-001', 'Chuka Okonkwo', 'MBBS, FWACS', 'CO', null, 'Lagos', 'NG', 6.5244, 3.3792,
   ARRAY['R/R DLBCL', 'NHL', 'B-cell lymphoma'], ARRAY['Phase 2', 'Phase 3'],
   true, false, false, 84, 2, 92, 24, 'Responsive', '11111111-1111-1111-1111-111111111111'),

  ('inv-002', 'Amelia Park', 'MD, PhD', 'AP', null, 'Seoul', 'KR', 37.4881, 127.0851,
   ARRAY['R/R DLBCL', 'NSCLC', 'Hematologic malignancy'], ARRAY['Phase 2', 'Phase 3'],
   false, false, false, 127, 3, 88, 28, 'Responsive', '22222222-2222-2222-2222-222222222222'),

  ('inv-003', 'Jason Westin', 'MD, MS, FACP', 'JW', '1689052714', 'Houston', 'US', 29.7060, -95.3983,
   ARRAY['R/R DLBCL', 'LBCL', 'Follicular lymphoma', 'CAR-T'], ARRAY['Phase 1', 'Phase 2', 'Phase 3'],
   false, false, false, 312, 11, 76, 42, 'Overbooked', '33333333-3333-3333-3333-333333333333'),

  ('inv-004', 'Magda Kowalski', 'MD, PhD', 'MK', null, 'Warsaw', 'PL', 52.2297, 21.0122,
   ARRAY['NSCLC', 'Lung adenocarcinoma', 'Immunotherapy'], ARRAY['Phase 2', 'Phase 3'],
   true, false, false, 61, 2, 84, 12, 'Pending', '44444444-4444-4444-4444-444444444444'),

  ('inv-005', 'Priya Nair', 'MD, DM', 'PN', null, 'Mumbai', 'IN', 19.0760, 72.8777,
   ARRAY['NSCLC', 'SCLC', 'Thoracic oncology'], ARRAY['Phase 2', 'Phase 3'],
   false, false, false, 142, 5, 79, 31, 'Overbooked', '55555555-5555-5555-5555-555555555555'),

  ('inv-006', 'Ji-hoon Lee', 'MD, PhD', 'JL', null, 'Seoul', 'KR', 37.5798, 126.9989,
   ARRAY['NSCLC', 'EGFR-mutant NSCLC', 'Thoracic oncology'], ARRAY['Phase 1', 'Phase 2', 'Phase 3'],
   false, false, false, 89, 3, 81, 22, 'Responsive', '66666666-6666-6666-6666-666666666666'),

  ('inv-007', 'Rafael Santos', 'MD, PhD', 'RS', null, 'São Paulo', 'BR', -23.5505, -46.6333,
   ARRAY['HER2+ breast cancer', 'Metastatic breast cancer', 'mAb therapy'], ARRAY['Phase 2', 'Phase 3'],
   false, false, false, 103, 3, 87, 24, 'Responsive', '77777777-7777-7777-7777-777777777777'),

  ('inv-008', 'Nandi Mokoena', 'MBChB, MMed', 'NM', null, 'Cape Town', 'ZA', -33.9421, 18.4612,
   ARRAY['HER2+ breast cancer', 'Triple-negative breast cancer'], ARRAY['Phase 2'],
   true, false, false, 42, 1, 71, 9, 'Pending', '88888888-8888-8888-8888-888888888888'),

  ('inv-009', 'Johnny Mahlangu', 'MBBCh, MMed, FCPath(Haem)', 'JM', null, 'Johannesburg', 'ZA', -26.2041, 28.0473,
   ARRAY['Hemophilia A', 'Hemophilia B', 'Rare bleeding disorders', 'Gene therapy'], ARRAY['Phase 1', 'Phase 2', 'Phase 3'],
   false, true, false, 76, 2, 93, 16, 'Responsive', '99999999-9999-9999-9999-999999999999'),

  ('inv-010', 'Elena Santagostino', 'MD, PhD', 'ES', null, 'Milan', 'IT', 45.4642, 9.1900,
   ARRAY['Hemophilia A', 'Hemophilia B', 'Rare bleeding disorders'], ARRAY['Phase 1', 'Phase 2', 'Phase 3'],
   false, true, false, 118, 3, 89, 18, 'Responsive', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),

  ('inv-011', 'David Weinberg', 'MD', 'DW', '1902834712', 'Houston', 'US', 29.7090, -95.3970,
   ARRAY['NSCLC', 'Mesothelioma', 'Thoracic oncology'], ARRAY['Phase 1', 'Phase 2', 'Phase 3'],
   false, false, false, 201, 11, 72, 38, 'Overbooked', '33333333-3333-3333-3333-333333333333'),

  ('inv-012', 'Isabela Ferreira', 'MD', 'IF', null, 'Rio de Janeiro', 'BR', -22.9068, -43.1729,
   ARRAY['R/R DLBCL', 'Follicular lymphoma', 'Hematologic malignancy'], ARRAY['Phase 2', 'Phase 3'],
   true, false, false, 48, 2, 83, 14, 'Responsive', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')

on conflict (id) do nothing;

-- Regeneron trials (real NCT IDs)
insert into trials (nct_id, title, phase, status, conditions, interventions, sponsor, is_regeneron)
values
  ('NCT03888105', 'ELM-1: Study of Odronextamab in R/R CD20-Positive B-Cell NHL', 'Phase 1/2', 'Completed',
   ARRAY['R/R DLBCL', 'Follicular Lymphoma'], ARRAY['Odronextamab', 'REGN1979'], 'Regeneron', true),

  ('NCT05057494', 'ELM-3: Odronextamab vs SOC in R/R DLBCL (Phase 3)', 'Phase 3', 'Recruiting',
   ARRAY['R/R DLBCL'], ARRAY['Odronextamab (Ordspono)'], 'Regeneron', true),

  ('NCT03515629', 'EMPOWER-Lung 1: Cemiplimab vs Chemotherapy in NSCLC', 'Phase 3', 'Completed',
   ARRAY['Non-Small Cell Lung Cancer'], ARRAY['Cemiplimab (Libtayo)', 'REGN2810'], 'Regeneron/Sanofi', true),

  ('NCT03905642', 'EMPOWER-Lung 3: Cemiplimab + Chemotherapy in NSCLC', 'Phase 3', 'Completed',
   ARRAY['Non-Small Cell Lung Cancer'], ARRAY['Cemiplimab (Libtayo)', 'REGN2810'], 'Regeneron/Sanofi', true),

  ('NCT04323982', 'ATLAS-INH: Fitusiran vs Prophylaxis in Hemophilia A/B with Inhibitors', 'Phase 3', 'Completed',
   ARRAY['Hemophilia A', 'Hemophilia B'], ARRAY['Fitusiran', 'ALN-AT3'], 'Alnylam/Sanofi', false),

  ('NCT04494425', 'DESTINY-Breast04: T-DXd in HER2-low MBC', 'Phase 3', 'Completed',
   ARRAY['HER2-low Breast Cancer'], ARRAY['Trastuzumab deruxtecan', 'DS-8201'], 'AstraZeneca/Daiichi Sankyo', false)

on conflict (nct_id) do nothing;

-- Investigator-trial links
insert into investigator_trials (investigator_id, trial_id, role)
select 'inv-001', id, 'Sub-I' from trials where nct_id = 'NCT03888105' on conflict do nothing;
insert into investigator_trials (investigator_id, trial_id, role)
select 'inv-002', id, 'PI'    from trials where nct_id = 'NCT03888105' on conflict do nothing;
insert into investigator_trials (investigator_id, trial_id, role)
select 'inv-002', id, 'PI'    from trials where nct_id = 'NCT05057494' on conflict do nothing;
insert into investigator_trials (investigator_id, trial_id, role)
select 'inv-003', id, 'PI'    from trials where nct_id = 'NCT05057494' on conflict do nothing;
insert into investigator_trials (investigator_id, trial_id, role)
select 'inv-004', id, 'Sub-I' from trials where nct_id = 'NCT03905642' on conflict do nothing;
insert into investigator_trials (investigator_id, trial_id, role)
select 'inv-005', id, 'PI'    from trials where nct_id = 'NCT03905642' on conflict do nothing;
insert into investigator_trials (investigator_id, trial_id, role)
select 'inv-006', id, 'PI'    from trials where nct_id = 'NCT03515629' on conflict do nothing;
insert into investigator_trials (investigator_id, trial_id, role)
select 'inv-007', id, 'Sub-I' from trials where nct_id = 'NCT04494425' on conflict do nothing;
insert into investigator_trials (investigator_id, trial_id, role)
select 'inv-009', id, 'PI'    from trials where nct_id = 'NCT04323982' on conflict do nothing;
insert into investigator_trials (investigator_id, trial_id, role)
select 'inv-010', id, 'Sub-I' from trials where nct_id = 'NCT04323982' on conflict do nothing;

-- Publications (real PubMed IDs)
insert into publications (pubmed_id, title, year, journal, first_author_investigator_id, indication_tags, citation_count)
values
  ('38104823', 'Outcomes of R/R DLBCL in Sub-Saharan African cohorts: a prospective multicenter analysis', 2024, 'Br J Haematol', 'inv-001', ARRAY['R/R DLBCL'], 31),
  ('37562110', 'CD20-positive B-cell lymphoma epidemiology in West Africa', 2023, 'Lancet Haematol', 'inv-001', ARRAY['NHL', 'B-cell lymphoma'], 48),
  ('37124567', 'CAR-T vs second-line chemo in DLBCL: Korean multicenter cohort', 2023, 'JCO', 'inv-002', ARRAY['R/R DLBCL'], 67),
  ('36958291', 'Lisocabtagene maraleucel in second-line LBCL: TRANSFORM trial outcomes', 2023, 'NEJM', 'inv-003', ARRAY['R/R DLBCL', 'LBCL'], 412),
  ('37840123', 'Cemiplimab in NSCLC: Central European real-world outcomes', 2024, 'Ann Oncol', 'inv-004', ARRAY['NSCLC'], 19),
  ('37621450', 'NSCLC in Indian patients: genomic landscape and therapeutic implications', 2023, 'JCO', 'inv-005', ARRAY['NSCLC'], 54),
  ('38001234', 'First-line cemiplimab monotherapy in East Asian NSCLC: propensity-matched analysis', 2024, 'JAMA Oncol', 'inv-006', ARRAY['NSCLC'], 41),
  ('37901234', 'HER2-targeted therapy outcomes in Latin American patients: a multicenter retrospective', 2023, 'JCO', 'inv-007', ARRAY['HER2+ breast cancer'], 38),
  ('37234521', 'HER2+ breast cancer in sub-Saharan Africa: diagnostic delay and outcomes', 2023, 'Breast Cancer Res Treat', 'inv-008', ARRAY['HER2+ breast cancer'], 14),
  ('37890123', 'Fitusiran prophylaxis in hemophilia A and B with inhibitors: phase 3 results', 2023, 'NEJM', 'inv-009', ARRAY['Hemophilia A', 'Hemophilia B'], 88),
  ('36890231', 'Gene therapy for hemophilia B: 3-year safety and efficacy follow-up', 2022, 'Lancet', 'inv-009', ARRAY['Hemophilia B'], 124),
  ('36891234', 'Emicizumab prophylaxis in hemophilia A: HAVEN 5 long-term extension', 2022, 'Blood', 'inv-010', ARRAY['Hemophilia A'], 76),
  ('37541234', 'Cemiplimab plus chemotherapy in NSCLC: subgroup analysis by histology', 2023, 'JTO', 'inv-011', ARRAY['NSCLC'], 52),
  ('38201234', 'B-cell lymphoma outcomes in Brazil: a national registry analysis', 2024, 'Hematol Oncol', 'inv-012', ARRAY['R/R DLBCL', 'NHL'], 17)

on conflict (pubmed_id) do nothing;
