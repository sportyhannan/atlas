# Dr. David Okonkwo

**Source:** `supabase/seedSecondary.sql` · **Investigator id:** `e0000008-aaaa-bbbb-cccc-000000000008`
**Site:** UPMC Presbyterian · Pittsburgh, PA, US
**Profile:** US neurosurgery / traumatic brain injury PI. Carries a 2023 483 observation letter — a teaching example of a negative-signal investigator.

## Sample query

> `traumatic brain injury principal investigator in Pennsylvania with FDA IND experience`

## Why it lands on Okonkwo

- `investigators.focus = ["Phase 2","Neurology","Traumatic Brain Injury"]` + `site_location = "Pittsburgh, PA, US"` — only TBI / neurosurgery seed.
- `clinicaltrials_studies.conditions = ["Traumatic Brain Injury","Severe TBI","Brain Injury"]` on NCT06100008, intervention `"Progesterone IV"`, with his `resolved_investigator_id` as PI.
- `pubmed_articles.mesh_terms = ["Brain Injuries, Traumatic","Progesterone","Neuroprotection"]` on pubmed 39100008 (Journal of Neurotrauma).
- `openalex_authors.concepts`: Traumatic brain injury 0.90 / Neurosurgery 0.82 / Intracranial pressure 0.71 at UPMC.
- `npi_providers.primary_taxonomy = "207T00000X"` (Neurological Surgery), PA practice state.
- `fda_bmis.ind_number = "IND-198765"`, sponsor BHR Pharma, indication "Severe Traumatic Brain Injury".
- **Negative signal:** `fda_483_letters` 2023 observation citing "Protocol deviation not reported within required window" and "Incomplete drug accountability records". Agent should mention this in the reason and lower rank but not auto-exclude.
- `investigators.status = "overbooked"` + low `score_capacity = 48` — further context the agent can cite.

## Expected evidence chips

`nct:NCT06100008`, `pubmed:39100008`, `openalex:A6100000008`, `npi:2100000008`, `bmis:IND-198765`, `fda483`, `cms:BHR Pharma`

## Alternative queries

- `neurosurgery PI at UPMC with progesterone TBI trial`
- `US Phase 2 investigator for severe traumatic brain injury`
- `IND 1572 holder for neuroprotection trial in Pennsylvania`
