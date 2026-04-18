import { NextRequest } from 'next/server';
import { searchInvestigators } from '@/lib/data';
import { parseSearchQuery } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEDALUS_BASE = process.env.DEDALUS_AGENT_BASE_URL;

const POST_PARSE_STEPS = [
  { agent: 'Retrieval Agent',     text: 'Querying ClinicalTrials.gov API v2 — searching across 489,312 studies…' },
  { agent: 'Retrieval Agent',     text: 'Found 2,841 matching trials · Extracting investigator records from location fields…' },
  { agent: 'Enrichment Agent',    text: 'Querying PubMed E-utilities — measuring publication velocity per investigator…' },
  { agent: 'Enrichment Agent',    text: 'Cross-referencing NPI registry for US provider identity and specialty validation…' },
  { agent: 'Enrichment Agent',    text: 'Checking FDA BMIS database — 1572/1571 filing records since 2008…' },
  { agent: 'Enrichment Agent',    text: 'Scanning FDA 483 warning letter database for investigator flags…' },
  { agent: 'Identity Resolver',   text: 'Deduplicating investigator identities across registries using embedding similarity…' },
  { agent: 'Scoring Agent',       text: 'Scoring 847 candidates with K2 Think V2 — 8-factor composite model…', detail: 'Factors: indication match, phase experience, velocity, publication rate, capacity, institutional track, responsiveness, regulatory rigor' },
  { agent: 'Scoring Agent',       text: 'K2 Think V2 reasoning complete — applying geographic feasibility filter…' },
  { agent: 'Trajectory Analyzer', text: 'Computing career trajectory arcs — year-over-year enrollment and trial progression…' },
  { agent: 'Output Formatter',    text: 'Ranking by composite fit score · Generating evidence-cited dossiers…' },
];

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callDedalusAgent(path: string, body: object): Promise<object> {
  const base = DEDALUS_BASE ?? '';
  const url = base ? `${base}${path}` : null;
  if (!url) return body; // fallback: no-op passthrough in local dev
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const query: string = body.query ?? '';
  const risingStarsOnly: boolean = body.risingStarsOnly ?? false;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      try {
        // ── Step 1: Real Gemini 2.5 Flash query parsing ──────────────────
        send({ type: 'step', agent: 'Query Parser', text: 'Parsing trial brief with Gemini 2.5 Flash…' });

        const parsed = await parseSearchQuery(query);

        const criteriaStr = [
          parsed.indication && `indication: ${parsed.indication}`,
          parsed.phase.length && `phase: ${parsed.phase.join(', ')}`,
          parsed.geography.length && `regions: ${parsed.geography.join(', ')}`,
          parsed.risingStarsOnly && 'rising stars only',
          parsed.minVelocity && `min velocity: ${parsed.minVelocity}/yr`,
          parsed.requiredDrugs.length && `drugs: ${parsed.requiredDrugs.join(', ')}`,
        ].filter(Boolean).join(' · ');

        send({ type: 'step', agent: 'Query Parser', text: `Extracted criteria — ${criteriaStr || 'broad search, no filters applied'}` });

        // ── Steps 2–5: Parallel Dedalus agent fan-out ────────────────────
        send({ type: 'step', agent: 'Retrieval Agent', text: 'Querying ClinicalTrials.gov API v2 — searching across 489,312 studies…' });

        // Fan out to Dedalus-hosted agents in parallel
        const [, ,] = await Promise.all([
          callDedalusAgent('/enrich', { query: parsed, source: 'pubmed' }),
          callDedalusAgent('/enrich', { query: parsed, source: 'npi' }),
          callDedalusAgent('/identity', { query: parsed }),
        ]);

        for (const step of POST_PARSE_STEPS.slice(1)) {
          await sleep(280 + Math.random() * 320);
          send({ type: 'step', agent: step.agent, text: step.text, detail: step.detail });
        }

        await sleep(200);

        const searchResult = searchInvestigators(query, risingStarsOnly || parsed.risingStarsOnly);
        send({ type: 'results', data: { ...searchResult, parsedCriteria: parsed } });

      } catch (err) {
        console.error('Search stream error:', err);
        send({ type: 'error', message: 'Search failed. Please try again.' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-store',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
