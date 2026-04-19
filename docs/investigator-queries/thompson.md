# Dr. Emma Thompson

**Source:** `supabase/seedSecondary.sql` · **Investigator id:** `e000000b-aaaa-bbbb-cccc-00000000000b`
**Site:** Imperial College Healthcare NHS Trust · London, GB
**Profile:** UK rheumatology / lupus / anifrolumab PI. EUCTR trials, NEJM publications.

## Sample query

> `systemic lupus erythematosus investigator in the UK with anifrolumab experience`

## Why it lands on Thompson

- `investigators.focus = ["Phase 3","Rheumatology","Systemic Lupus Erythematosus"]` + `site_location = "London, GB"` — only rheumatology / SLE seed and only UK-based seed.
- `ictrp_trials.condition = "Systemic Lupus Erythematosus"`, `intervention = "Anifrolumab (Saphnelo)"`, `source_registry = "EUCTR"`, `countries = ["GB","IE","NL"]` on EUCTR2023-SLE-UK-011.
- `pubmed_articles.mesh_terms = ["Lupus Erythematosus, Systemic","Interferon Type I","Antibodies, Monoclonal, Humanized"]`, `indication_tags = ["systemic lupus erythematosus","SLE","anifrolumab","rheumatology"]` on pubmed 39100011 (NEJM TULIP-UK four-year).
- `openalex_authors.concepts`: Systemic lupus erythematosus 0.90 / Anifrolumab 0.82 / Rheumatology 0.77 at Imperial College GB.

## Expected evidence chips

`ictrp:EUCTR2023-SLE-UK-011`, `pubmed:39100011`, `openalex:A610000000B`

## Alternative queries

- `anifrolumab moderate-to-severe SLE PI at Imperial College`
- `UK Phase 3 rheumatology investigator for type-I interferon pathway therapy`
- `TULIP-UK trial principal investigator in London`
