# Dr. Rajesh Patel

**Source:** `supabase/seedSecondary.sql` · **Investigator id:** `e0000006-aaaa-bbbb-cccc-000000000006`
**Site:** Kokilaben Dhirubhai Ambani Hospital · Mumbai, IN
**Profile:** Indian T2 diabetes / GLP-1 / semaglutide PI. Large enrollments, CTRI registry.

## Sample query

> `Type 2 diabetes GLP-1 investigator in India`

## Why it lands on Patel

- `investigators.focus = ["Phase 3","Endocrinology","Type 2 Diabetes"]` + `site_location = "Mumbai, IN"` — only endocrinology/diabetes seed.
- `ictrp_trials.condition = "Type 2 Diabetes Mellitus"`, `intervention = "Oral semaglutide 14mg"`, `source_registry = "CTRI"`, `countries = ["IN"]` on CTRI-2024-03-065432.
- `pubmed_articles.mesh_terms = ["Diabetes Mellitus, Type 2","Glucagon-Like Peptide-1 Receptor","Hypoglycemic Agents"]`, `indication_tags = ["Type 2 diabetes","GLP-1","semaglutide","South Asia"]` on pubmed 39100006 (Diabetes Care).
- `openalex_authors.concepts`: Type 2 diabetes 0.91 / GLP-1 receptor agonist 0.88 / Semaglutide 0.70 at Kokilaben Hospital IN.
- `investigators.enrollments = 870`, `score_capacity = 83` reflect real-world cohort size.

## Expected evidence chips

`ictrp:CTRI-2024-03-065432`, `pubmed:39100006`, `openalex:A6100000006`

## Alternative queries

- `oral semaglutide Phase 3 PI in South Asia`
- `endocrinology investigator in Mumbai with large diabetes cohort`
- `Novo Nordisk GLP-1 real-world investigator in India`
