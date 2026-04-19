# MD/PhD Investigator Pipeline

Identifies high-signal MD/PhD student investigator candidates using five public data sources.

## Setup

```bash
# No dependencies — uses native fetch (Node 18+)
node --version   # must be >= 18

# Optional: add PubMed API key for higher rate limits (free)
# https://www.ncbi.nlm.nih.gov/account/
export PUBMED_API_KEY=your_key_here

node pipeline/index.js
```

## File structure

```
pipeline/
  index.js                  # Orchestrator + scoring
  sources/
    nihReporter.js          # NIH RePORTER F30 grants
    pubmed.js               # PubMed publication metrics
    orcid.js                # ORCID researcher profiles
    clinicalTrials.js       # ClinicalTrials.gov site data
    cms.js                  # CMS NPI + Open Payments (mentor)
```

## Data sources + what they provide

| Source | What you get | Auth required |
|---|---|---|
| NIH RePORTER | F30 grant holders (the cleanest MD/PhD list) | None |
| PubMed E-utilities | Publication count, co-author network | None (API key optional) |
| ORCID Public API | Verified profile, current affiliation | None |
| ClinicalTrials.gov v2 | Active trials at institution, investigator history | None |
| CMS NPI Registry | Mentor specialty, years in practice | None |
| CMS Open Payments | Mentor research payment history (pharma proxy) | None |

All sources are free and public. No credentials required to run.

## Scoring weights

Configurable in `index.js` under `CONFIG.weights`:

```js
weights: {
  researchOutput: 0.40,        // PubMed pubs + ORCID
  clinicalExposure: 0.35,      // Trial history + institution site
  institutionalReadiness: 0.25 // ClinicalTrials.gov site portfolio
}
```

Tune per therapeutic area:
- **Oncology early-phase**: tilt clinical (0.50) + institutional (0.30)
- **Investigator-initiated / academic**: tilt research (0.55)

## Output

`candidates_output.json` — array of scored candidate objects:

```json
{
  "name": "...",
  "institution": "...",
  "compositeScore": 74,
  "breakdown": {
    "researchOutput": 68,
    "clinicalExposure": 80,
    "institutionalReadiness": 75
  },
  "signals": {
    "totalPublications": 8,
    "pubsLast3Years": 4,
    "activeTrialsAtSite": 23,
    "phase2PlusTrials": 11,
    "investigatorTrialCount": 1
  },
  "needsReview": false
}
```

## Known limitations

- **Mentor extraction**: `cms.js` requires a mentor name. Currently a placeholder in the orchestrator — wire in by parsing F30 abstract acknowledgements or adding a mentor name field to your input.
- **PubMed name disambiguation**: common names may match multiple authors. Add affiliation filtering and cross-check against ORCID iD when available.
- **Open Payments lag**: most recent dataset is typically 18 months behind. Captures established mentors well; may miss newer PIs.
- **ClinicalTrials.gov site matching**: institution name strings are messy. Consider fuzzy matching against the `LeadSponsor` and `LocationFacility` fields.
