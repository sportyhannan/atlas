# Dr. Hiroshi Tanaka

**Source:** `supabase/seedSecondary.sql` · **Investigator id:** `e0000004-aaaa-bbbb-cccc-000000000004`
**Site:** National Cancer Center Hospital · Tokyo, JP
**Profile:** Japanese gastric cancer / HER2 / T-DXd PI. Academic-only, JPRN registry.

## Sample query

> `HER2-low gastric cancer investigator in Japan`

## Why it lands on Tanaka

- `investigators.focus = ["Phase 2","Oncology","Gastric Cancer"]` + `site_location = "Tokyo, JP"` — only gastric-cancer seed; Japan-only filter knocks out Park (KR), Zhang (CN).
- `ictrp_trials.condition = "Gastric Cancer"`, `intervention = "Trastuzumab deruxtecan (T-DXd)"`, `source_registry = "JPRN"`, `countries = ["JP"]` on JPRN-JapicCTI-2024-0041.
- `pubmed_articles.mesh_terms = ["Stomach Neoplasms","Receptor, ErbB-2","Antibody-Drug Conjugates"]`, `indication_tags = ["gastric cancer","HER2-low","trastuzumab deruxtecan","T-DXd"]` on pubmed 39100004 (JCO).
- `openalex_authors.concepts`: Gastric cancer 0.92 / HER2 0.85 / Trastuzumab deruxtecan 0.78 at National Cancer Center Hospital JP.

## Expected evidence chips

`ictrp:JPRN-JapicCTI-2024-0041`, `pubmed:39100004`, `openalex:A6100000004`

## Alternative queries

- `Trastuzumab deruxtecan GEJ adenocarcinoma PI in Tokyo`
- `HER2-targeted antibody-drug conjugate investigator in East Asia`
- `Japanese oncology Phase 2 investigator for stomach cancer`
