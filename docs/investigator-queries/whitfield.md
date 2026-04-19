# Dr. James Whitfield

**Source:** `supabase/seed.sql` · **Investigator id:** `c3456789-aaaa-bbbb-cccc-ddddeeeeffff`
**Site:** MD Anderson Cancer Center · Houston, TX, US
**Profile:** US CAR-T / DLBCL oncology PI with full FDA + CMS footprint, carries a 2022 483 observation.

## Sample query

> `CAR-T DLBCL investigator in Texas with FDA IND experience`

## Why it lands on Whitfield (not Park, the other oncology seed)

- `investigators.site_location = "Houston, TX, US"` + `npi_providers.practice_state = "TX"` match the region → Park (Seoul, KR) filtered out.
- `fda_bmis.ind_number = "IND-152340"`, `submission_type = "1572"` (Regeneron CAR-T) — Park has no `fda_bmis` row at all.
- `clinicaltrials_studies.conditions = ["DLBCL","Lymphoma"]` on NCT05100200, interventions include `"Investigational CAR-T"`.
- `pubmed_articles.mesh_terms = ["Lymphoma, Large B-Cell, Diffuse","Immunotherapy, Adoptive"]` on pubmed 38200001.
- `npi_providers.primary_taxonomy = "207RH0000X"` (Hematology & Oncology), `is_oncology = true`.
- `cms_open_payments` shows $84.5K research + $12K consulting from Regeneron / Merck.
- `fda_483_letters` flags the 2022 observation letter — agent should surface but not auto-exclude.

## Expected evidence chips

`nct:NCT05100200`, `pubmed:38200001`, `openalex:A5011223344`, `npi:1234567890`, `bmis:IND-152340`, `fda483`, `cms:Regeneron`

## Alternative queries

- `Hematology oncology principal investigator with CAR-T IND at MD Anderson`
- `US oncology PI with Regeneron research payments`
- `DLBCL lymphoma investigator with FDA 1572 submission`
