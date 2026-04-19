# Dr. Isabella Romano

**Source:** `supabase/seedSecondary.sql` · **Investigator id:** `e0000009-aaaa-bbbb-cccc-000000000009`
**Site:** Ospedale San Raffaele · Milan, IT
**Profile:** Italian MS / ocrelizumab PI. EUCTR trials, Lancet Neurology publications.

## Sample query

> `primary progressive multiple sclerosis investigator in Italy`

## Why it lands on Romano

- `investigators.focus = ["Phase 3","Neurology","Multiple Sclerosis"]` + `site_location = "Milan, IT"` — only MS-focused and only Italy-based seed.
- `ictrp_trials.condition = "Multiple Sclerosis"`, `intervention = "Ocrelizumab (Ocrevus)"`, `source_registry = "EUCTR"`, `countries = ["IT","FR","DE","ES"]` on EUCTR2023-MS-IT-004.
- `pubmed_articles.mesh_terms = ["Multiple Sclerosis, Chronic Progressive","Antibodies, Monoclonal, Humanized","Immunologic Factors"]`, `indication_tags = ["multiple sclerosis","PPMS","ocrelizumab"]` on pubmed 39100009 (The Lancet Neurology).
- `openalex_authors.concepts`: Multiple sclerosis 0.94 / Ocrelizumab 0.81 / Demyelinating disease 0.76 at San Raffaele IT.

## Expected evidence chips

`ictrp:EUCTR2023-MS-IT-004`, `pubmed:39100009`, `openalex:A6100000009`

## Alternative queries

- `Ocrelizumab PPMS long-term follow-up PI at San Raffaele`
- `EU Phase 3 neurology investigator for demyelinating disease`
- `multiple sclerosis principal investigator in Milan`
