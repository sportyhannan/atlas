# Atlas — The talent layer for global clinical trials azra yes

> Moneyball for clinical trial investigators. Built at HackPrinceton Spring 2026.

**[Live demo ↗](https://atlas-trials.ai)** · **[Pitch deck ↗](#)** · **[Demo video ↗](#)**

---

## The problem

Pharma spends **$6.6B/year** recruiting patients for clinical trials. **78% of trials fail to enroll on time.** Every delayed day costs $800K in NPV.

The bottleneck is not patients. It is finding the right investigator to enroll them. Today's incumbent databases (Citeline, DrugDev) serve scraped bios from 2013 at $250K/year. They index the same 2% of doctors who have already run trials. The other 98% — including the rising stars in Lagos, Warsaw, and São Paulo who are publishing prolifically but have never been approached for an industry trial — are invisible.

## What Atlas does

A natural-language search over a continuously-updated graph of:

| Source | What we extract |
|---|---|
| **ClinicalTrials.gov v2 API** | Investigator names, sites, cities, countries, phases, enrollment counts |
| **PubMed E-utilities** | Publication velocity, indication relevance, citation counts |
| **FDA BMIS** | Form 1572/1571 filings — clinical investigator records since 2008 |
| **NPI Registry** | US provider identity, specialty, address freshness |
| **FDA 483 warning letters** | Negative compliance signal — flags investigators with prior violations |
| **WHO ICTRP** | International registry (documented; Phase 2 integration) |

You type a trial brief. Atlas returns a ranked list of investigators in 5 seconds with every claim cited.

## Demo

Type: *"Phase 3 R/R DLBCL, 22 sites global, rising stars only"*

Watch Atlas:
1. Stream a live reasoning trace — agent-by-agent, source-by-source
2. Return a ranked table of investigators with fit scores (0–100) across 8 weighted factors
3. Click any row → full dossier: fit breakdown, enrollment velocity sparkline, publications, trial history, institutional track record, 483 flags
4. Compare 2–3 investigators side-by-side on every scoring factor
5. Toggle **Rising stars** to surface investigators with strong publication velocity and zero prior industry trials

## Architecture

```
Natural-language query
        │
        ▼
┌─────────────────┐
│  Query Parser   │  Gemini 2.5 Flash — extracts structured criteria
│  (Gemini Flash) │  {indication, phase, regions, rising_stars, ...}
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Retrieval Agent│  Supabase pgvector — semantic + structured filter
│  (pgvector)     │  → top 200 candidates
└────────┬────────┘
         │
    ┌────┴────────────────────────────────────────┐
    │         Enrichment Swarm (parallel)          │
    │  ┌──────────────┐  ┌──────────────────────┐  │
    │  │ PubMed Agent │  │ ClinicalTrials Agent  │  │
    │  └──────────────┘  └──────────────────────┘  │
    │  ┌──────────────┐  ┌──────────────────────┐  │
    │  │   NPI Agent  │  │  FDA 483 Agent        │  │
    │  └──────────────┘  └──────────────────────┘  │
    └────────────────────┬────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   Scoring Agent     │  K2 Think V2 (core reasoning)
              │  (K2 Think V2)      │  8-factor composite fit score
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  Output Formatter   │  Evidence-cited ranked list
              └─────────────────────┘
```

**Stack:**
- **Frontend:** Next.js 16 (App Router), TypeScript, Recharts, react-leaflet
- **Database:** Supabase (Postgres + pgvector + RLS)
- **Agent orchestration:** LangGraph (Python) — Dedalus-container eligible
- **Core reasoning:** K2 Think V2 from IFM/MBZUAI — the 70B reasoning model scores every investigator
- **Fast LLM:** Gemini 2.5 Flash — query parsing and data extraction
- **MCP server:** TypeScript, wraps ClinicalTrials.gov v2, PubMed, NPI, FDA 483

## Scoring factors (8-dimensional)

| Factor | Weight | Source |
|---|---|---|
| Indication match | Semantic similarity of past work to trial brief | PubMed + ClinicalTrials.gov |
| Phase experience | Has run same-phase trials? | ClinicalTrials.gov |
| Enrollment velocity | Patients enrolled per trial-year, trend | ClinicalTrials.gov |
| Publication velocity | Pubs per year in indication, last 24 months | PubMed |
| Capacity | Active trial count — lower is better | ClinicalTrials.gov |
| Institutional track record | Site's historical performance | ClinicalTrials.gov + FDA |
| Responsiveness proxy | Email freshness, still at institution | NPI + ClinicalTrials.gov |
| Regulatory rigor | 1572 filings vs 483 flags | FDA BMIS + FDA 483 DB |

## Running locally

```bash
git clone https://github.com/sportyhannan/hackmtc
cd hackmtc
npm install

# Set env vars
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

npm run dev
# → http://localhost:3000
```

## Database setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Open SQL Editor → paste and run `supabase/schema.sql`
3. Run `supabase/seed.sql` to load 12 demo investigators with real NCT IDs and PubMed IDs
4. Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`

## Real data ingestion

For production-scale data, run the ingestion scripts:

```bash
pip install httpx supabase python-dotenv beautifulsoup4
export SUPABASE_SERVICE_ROLE_KEY=...  # service role key, not anon

# Ingest from ClinicalTrials.gov + PubMed (~500 investigators)
python scripts/ingest_clinicaltrials.py

# Ingest FDA 483 warning letters
python scripts/ingest_fda_483.py
```

## MCP server (Claude Desktop)

Load Atlas's data layer into Claude Desktop:

```json
{
  "mcpServers": {
    "atlas": {
      "command": "npx",
      "args": ["tsx", "/path/to/hackmtc/mcp/server.ts"],
      "env": {
        "ATLAS_SUPABASE_URL": "...",
        "ATLAS_SUPABASE_KEY": "..."
      }
    }
  }
}
```

Available tools: `searchInvestigators`, `getInvestigatorDossier`, `searchClinicalTrials`, `searchPubMed`, `check483Letters`

## Data sources and citations

Every recommendation cites its source. Click any identifier to view the original record:

- `NCT05057494` → [clinicaltrials.gov/study/NCT05057494](https://clinicaltrials.gov/study/NCT05057494)
- `PubMed:38104823` → [pubmed.ncbi.nlm.nih.gov/38104823](https://pubmed.ncbi.nlm.nih.gov/38104823)
- NPI identifiers → [npiregistry.cms.hhs.gov](https://npiregistry.cms.hhs.gov)

## Business model

| Segment | ACV | Why |
|---|---|---|
| Rare-disease biotechs | $50K–$250K | Indications missing from Citeline |
| Mid-to-large pharma | $200K–$2M | Replaces Citeline ($250K) + site selection consulting ($2–5M/trial) |
| CROs (IQVIA, ICON) | $500K–$5M | Data edge they resell |

TAM: $14B/year clinical trial operations software, 12% CAGR.

## Future work

- EUCTR, CTIS, ISRCTN, ChiCTR integration (documented in architecture)
- Outreach automation — draft 1572 invitation letters per investigator
- Site feasibility questionnaire auto-fill from public hospital pages
- Responsiveness scoring trained on past outreach outcome data
- Full WHO ICTRP ingestion (~1M international trial records)

## The team

Built at HackPrinceton Spring 2026 — Princeton University, April 17–19, 2026.

## License

MIT — see [LICENSE](LICENSE)
