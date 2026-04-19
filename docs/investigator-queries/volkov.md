# Dr. Elena Volkov

**Source:** `supabase/seedSecondary.sql` · **Investigator id:** `e0000003-aaaa-bbbb-cccc-000000000003`
**Site:** N.N. Blokhin Cancer Research Center · Moscow, RU
**Profile:** Russian hematology / AML PI. ICTRP-only (RUSCTR), no US regulatory signals.

## Sample query

> `FLT3-mutant AML investigator in Russia`

## Why it lands on Volkov

- `investigators.focus = ["Phase 2","Hematology","AML"]` + `site_location = "Moscow, RU"` — only Russia-based and only AML-focused seed.
- `ictrp_trials.condition = "Acute Myeloid Leukemia"`, `intervention = "Midostaurin + 7+3 induction"`, `source_registry = "RUSCTR"`, `countries = ["RU"]` on RUSCTR-2024-AML-001.
- `pubmed_articles.mesh_terms = ["Leukemia, Myeloid, Acute","fms-Like Tyrosine Kinase 3","Protein Kinase Inhibitors"]` on pubmed 39100003 (Blood).
- `openalex_authors.concepts`: AML 0.89 / FLT3 mutation 0.81 / Midostaurin 0.68 at Blokhin Cancer Research Center.
- **No** `npi_providers`, `fda_bmis`, `cms_open_payments` — the region + AML focus isolates her.

## Expected evidence chips

`ictrp:RUSCTR-2024-AML-001`, `pubmed:39100003`, `openalex:A6100000003`

## Alternative queries

- `Midostaurin AML principal investigator at Blokhin`
- `Russian hematology Phase 2 investigator for FLT3-ITD leukemia`
- `acute myeloid leukemia PI in Eastern Europe`
