# Dr. Wei Zhang

**Source:** `supabase/seedSecondary.sql` · **Investigator id:** `e000000a-aaaa-bbbb-cccc-00000000000a`
**Site:** Fudan University Shanghai Cancer Center · Shanghai, CN
**Profile:** Chinese HCC / liver-cancer PI. ChiCTR registry, atezolizumab + bevacizumab focus.

## Sample query

> `hepatocellular carcinoma investigator in China with atezolizumab experience`

## Why it lands on Zhang

- `investigators.focus = ["Phase 3","Oncology","Hepatocellular Carcinoma"]` + `site_location = "Shanghai, CN"` — only HCC seed and only China-based seed.
- `ictrp_trials.condition = "Hepatocellular Carcinoma"`, `intervention = "Atezolizumab + Bevacizumab"`, `source_registry = "ChiCTR"`, `countries = ["CN"]` on ChiCTR2400080112.
- `pubmed_articles.mesh_terms = ["Carcinoma, Hepatocellular","Liver Neoplasms","Antibodies, Monoclonal, Humanized"]`, `indication_tags = ["HCC","hepatocellular carcinoma","atezolizumab","bevacizumab"]` on pubmed 39100010 (The Lancet Oncology IMbrave150 China extension).
- `openalex_authors.concepts`: Hepatocellular carcinoma 0.91 / Atezolizumab 0.83 / Liver cancer 0.86 at Fudan University Shanghai Cancer Center CN, h-index 39.

## Expected evidence chips

`ictrp:ChiCTR2400080112`, `pubmed:39100010`, `openalex:A610000000A`

## Alternative queries

- `IMbrave150 China extension PI at Fudan`
- `Chinese oncology Phase 3 investigator for liver cancer immunotherapy`
- `unresectable HCC principal investigator in Shanghai`
