# Dr. Sarah Goldberg

**Source:** `supabase/seedSecondary.sql` · **Investigator id:** `e0000007-aaaa-bbbb-cccc-000000000007`
**Site:** Sheba Medical Center · Tel Aviv, IL
**Profile:** Israeli melanoma / checkpoint-inhibitor PI. Nivolumab + relatlimab focus, high-citation NEJM paper.

## Sample query

> `melanoma nivolumab relatlimab investigator in Israel`

## Why it lands on Goldberg

- `investigators.focus = ["Phase 3","Oncology","Melanoma"]` + `site_location = "Tel Aviv, IL"` — only melanoma seed and only Israel-based seed.
- `ictrp_trials.condition = "Metastatic Melanoma"`, `intervention = "Nivolumab + Relatlimab (Opdualag)"`, `source_registry = "ILMOH"`, `countries = ["IL"]` on IL-MOH-2023-MEL-220.
- `pubmed_articles.mesh_terms = ["Melanoma","Immune Checkpoint Inhibitors","Antibodies, Monoclonal"]`, `indication_tags = ["melanoma","nivolumab","relatlimab","checkpoint inhibitor"]` on pubmed 39100007 (NEJM RELATIVITY-047 long-term).
- `openalex_authors.concepts`: Melanoma 0.93 / Immune checkpoint inhibitor 0.86 / Nivolumab 0.79, h-index 41 at Sheba Medical Center IL.

## Expected evidence chips

`ictrp:IL-MOH-2023-MEL-220`, `pubmed:39100007`, `openalex:A6100000007`

## Alternative queries

- `Opdualag BRAF-wildtype metastatic melanoma PI at Sheba`
- `Israeli oncology Phase 3 investigator for checkpoint combination therapy`
- `LAG-3 melanoma trial investigator in the Middle East`
