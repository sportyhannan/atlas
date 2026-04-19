# Dr. Priya Raman

**Source:** `supabase/seedSecondary.sql` · **Investigator id:** `e0000001-aaaa-bbbb-cccc-000000000001`
**Site:** Massachusetts General Hospital · Boston, MA, US
**Profile:** US Alzheimer's / anti-amyloid PI. Full US signal stack (NCT + NPI + IND + CMS), high academic reputation.

## Sample query

> `Alzheimer's anti-amyloid investigator in Boston with FDA IND experience`

## Why it lands on Raman

- `investigators.focus = ["Phase 3","Neurology","Alzheimer's"]` + `site_location = "Boston, MA, US"` isolate the indication + region. No other seed investigator carries "Alzheimer's" in focus.
- `clinicaltrials_studies.conditions = ["Alzheimer's Disease","Early Alzheimer's","Mild Cognitive Impairment"]` on NCT06100001, interventions `["Lecanemab","Placebo"]`, where her `resolved_investigator_id` is PI via `clinicaltrials_investigators`.
- `pubmed_articles.mesh_terms = ["Alzheimer Disease","Amyloid beta-Peptides","Immunotherapy"]` on pubmed 39100001 (NEJM Clarity-AD extension).
- `openalex_authors.concepts`: Alzheimer's disease 0.94 / Anti-amyloid therapy 0.87, h-index 48 at MGH.
- `fda_bmis.ind_number = "IND-203410"`, `sponsor = "Eisai Inc."`, indication "Early Alzheimer's Disease".
- `npi_providers.primary_taxonomy = "2084N0400X"` (Neurology), MA practice state.
- `cms_open_payments`: $128.4K research from Eisai + $18.5K consulting from Biogen.

## Expected evidence chips

`nct:NCT06100001`, `pubmed:39100001`, `openalex:A6100000001`, `npi:2100000001`, `bmis:IND-203410`, `cms:Eisai`, `cms:Biogen`

## Alternative queries

- `Lecanemab investigator at Mass General`
- `anti-amyloid monoclonal antibody PI in Massachusetts`
- `high-fit neurology investigator for early Alzheimer's Phase 3 trials`
