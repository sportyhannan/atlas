# Dr. Marcus Chen

**Source:** `supabase/seedSecondary.sql` · **Investigator id:** `e0000002-aaaa-bbbb-cccc-000000000002`
**Site:** UCSF Medical Center · San Francisco, CA, US
**Profile:** US cardiology / heart-failure PI with SGLT2-inhibitor focus. Full US stack, AstraZeneca ties.

## Sample query

> `HFpEF heart failure investigator at UCSF with SGLT2 experience`

## Why it lands on Chen

- `investigators.focus = ["Phase 3","Cardiology","Heart Failure"]` + `site_location = "San Francisco, CA, US"` — only cardiology seed; all others are oncology/neurology/etc.
- `clinicaltrials_studies.conditions = ["Heart Failure","HFpEF","Chronic Heart Failure"]` on NCT06100002, intervention `"Dapagliflozin"`, with `clinicaltrials_investigators.resolved_investigator_id` matching.
- `pubmed_articles.mesh_terms = ["Heart Failure","Sodium-Glucose Transporter 2 Inhibitors","Ventricular Function"]` on pubmed 39100002 (JACC).
- `openalex_authors.concepts`: Heart failure 0.91 / SGLT2 inhibitor 0.82 / HFpEF 0.77 at UCSF.
- `fda_bmis.ind_number = "IND-204220"`, sponsor AstraZeneca, indication "Heart Failure with Preserved Ejection Fraction".
- `npi_providers.primary_taxonomy = "207RC0000X"` (Cardiovascular Disease), CA.
- `cms_open_payments`: $96.3K research from AstraZeneca.

## Expected evidence chips

`nct:NCT06100002`, `pubmed:39100002`, `openalex:A6100000002`, `npi:2100000002`, `bmis:IND-204220`, `cms:AstraZeneca`

## Alternative queries

- `Dapagliflozin HFpEF principal investigator in California`
- `SGLT2 inhibitor cardiology PI with AstraZeneca research payments`
- `Phase 3 heart failure investigator at a US academic medical center`
