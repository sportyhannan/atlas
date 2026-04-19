# Dr. Aisha Mbeki

**Source:** `supabase/seedSecondary.sql` · **Investigator id:** `e0000005-aaaa-bbbb-cccc-000000000005`
**Site:** Desmond Tutu HIV Foundation · Cape Town, ZA
**Profile:** South African HIV / long-acting PrEP PI. Massive enrollment (2400), PACTR trials, Lancet HIV publications.

## Sample query

> `long-acting cabotegravir HIV PrEP investigator in sub-Saharan Africa`

## Why it lands on Mbeki

- `investigators.focus = ["Phase 3","Infectious Disease","HIV"]` + `site_location = "Cape Town, ZA"` — only HIV/ID seed.
- `investigators.enrollments = 2400`, `velocity_per_year = 410` — by far the highest-volume seed, a signal of large-cohort prevention trial capacity.
- `ictrp_trials.condition = "HIV Prevention"`, `intervention = "Cabotegravir long-acting injectable"`, `source_registry = "PACTR"`, `countries = ["ZA","KE","UG","BW"]` on PACTR202311-HIV-CAB.
- `pubmed_articles.mesh_terms = ["HIV Infections","Pre-Exposure Prophylaxis","Anti-HIV Agents"]` on pubmed 39100005 (The Lancet HIV).
- `openalex_authors.concepts`: HIV prevention 0.95 / Pre-exposure prophylaxis 0.89 / Cabotegravir 0.74, h-index 52 at Desmond Tutu HIV Foundation ZA.

## Expected evidence chips

`ictrp:PACTR202311-HIV-CAB`, `pubmed:39100005`, `openalex:A6100000005`

## Alternative queries

- `HIV pre-exposure prophylaxis PI at Desmond Tutu HIV Foundation`
- `high-enrollment infectious disease investigator in South Africa`
- `CAB-LA implementation researcher in Africa`
