# Dr. Sofia Costa

**Source:** `supabase/seed.sql` · **Investigator id:** `d7777777-eeee-ffff-aaaa-111122223333`
**Site:** Champalimaud Foundation · Lisbon, PT
**Profile:** Portuguese Phase 1 gene-therapy PI — rare-disease cohort, EU/non-US only, academic signal only.

## Sample query

> `gene therapy Phase 1 investigator for rare retinal disease in Europe`

## Why it lands on Costa (not Park or Whitfield)

- `investigators.focus = ["Phase 1","Rare Disease"]` + `site_location = "Lisbon, PT"` match phase/region → oncology seeds are Phase 2/3 and elsewhere.
- `ictrp_trials.condition = "Leber Congenital Amaurosis"` with `intervention = "AAV-RPE65"` on EUCTR2023-009876-02, `countries = ["PT","ES","IT"]`.
- `pubmed_articles.mesh_terms = ["Leber Congenital Amaurosis","Genetic Therapy"]`, NEJM pubmed 38300001.
- `openalex_authors.concepts`: Gene therapy 0.91 / Retinal dystrophy 0.85 at Champalimaud Foundation PT.
- **No** `npi_providers`, `fda_bmis`, `cms_open_payments`, or `clinicaltrials_investigators` rows — the region + Phase 1 rare-disease profile is what isolates her.

## Expected evidence chips

`ictrp:EUCTR2023-009876-02`, `pubmed:38300001`, `openalex:A5099887766`

## Alternative queries

- `AAV gene therapy investigator at Champalimaud Foundation`
- `Leber congenital amaurosis Phase 1 PI in Portugal`
- `retinal dystrophy first-in-human investigator in Iberia`
