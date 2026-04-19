# Dr. Amelia Park

**Source:** `supabase/seed.sql` · **Investigator id:** `b452bdf6-32ab-45f9-b696-c6927849e735`
**Site:** Samsung Medical Center · Seoul, KR
**Profile:** NSCLC / immunotherapy / pembrolizumab PI — non-US academic with EU cross-registration.

## Sample query

> `NSCLC principal investigator in Korea`

## Why it lands on Park (not Whitfield, the other NSCLC-adjacent seed)

- `investigators.site_location = "Seoul, KR"` + `clinicaltrials_investigators.country = "KR"` match the region filter → Whitfield (Houston, TX) gets filtered out.
- `clinicaltrials_studies.conditions = ["NSCLC","Lung Cancer"]` on NCT05001234 / NCT05009999 where her `resolved_investigator_id` is listed as PI.
- `pubmed_articles.mesh_terms = ["Lung Neoplasms","Immunotherapy"]` on pubmed 38100001 with her id in `resolved_author_ids`.
- `openalex_authors.concepts`: NSCLC 0.93 / Immunotherapy 0.78, Samsung Medical Center KR.
- `ictrp_trials` EUCTR2023-001234-01 cross-registration reinforces the non-US footprint.

## Expected evidence chips

`nct:NCT05001234`, `nct:NCT05009999`, `pubmed:38100001`, `ictrp:EUCTR2023-001234-01`, `openalex:A5023888391`

## Alternative queries

- `Pembrolizumab lung cancer PI at Samsung Medical Center`
- `EGFR NSCLC investigator in Asia with Phase 3 trial experience`
- `immunotherapy oncology principal investigator Seoul`
