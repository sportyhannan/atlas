# Dr. Carlos Mendoza

**Source:** `supabase/seedSecondary.sql` · **Investigator id:** `e000000c-aaaa-bbbb-cccc-00000000000c`
**Site:** A.C. Camargo Cancer Center · São Paulo, BR
**Profile:** Brazilian pediatric oncology / neuroblastoma / anti-GD2 PI. REBEC registry, rising-trajectory rare-disease profile.

## Sample query

> `pediatric neuroblastoma anti-GD2 investigator in Brazil`

## Why it lands on Mendoza

- `investigators.focus = ["Phase 2","Pediatric Oncology","Neuroblastoma"]` + `site_location = "São Paulo, BR"` — only pediatric-oncology seed and only Brazil-based seed.
- `investigators.score_trajectory = 83` — highest trajectory among the secondary seed cohort, flagging "Rising".
- `ictrp_trials.condition = "Neuroblastoma"`, `intervention = "Dinutuximab beta (anti-GD2 mAb)"`, `source_registry = "REBEC"`, `countries = ["BR","AR","MX"]` on REBEC-RBR-7xk2pq.
- `pubmed_articles.mesh_terms = ["Neuroblastoma","Antibodies, Monoclonal","Pediatrics"]`, `indication_tags = ["neuroblastoma","pediatric oncology","GD2","dinutuximab beta"]` on pubmed 39100012 (JCO Brazilian compassionate-use cohort).
- `openalex_authors.concepts`: Neuroblastoma 0.93 / Pediatric oncology 0.88 / GD2 antibody 0.74 at A.C. Camargo Cancer Center BR.

## Expected evidence chips

`ictrp:REBEC-RBR-7xk2pq`, `pubmed:39100012`, `openalex:A610000000C`

## Alternative queries

- `dinutuximab beta high-risk neuroblastoma PI in São Paulo`
- `pediatric oncology Phase 2 investigator in Latin America`
- `rising-trajectory rare-cancer investigator in Brazil`
