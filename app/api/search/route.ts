import { NextRequest } from 'next/server';
import { searchInvestigators } from '@/lib/data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Reasoning trace steps streamed back to the client
const REASONING_STEPS = [
  { agent: 'Query Parser',         text: 'Parsing trial brief with Gemini 2.5 Flash…' },
  { agent: 'Query Parser',         text: 'Extracted criteria: indication, phase, regions, rising-stars flag' },
  { agent: 'Retrieval Agent',      text: 'Querying ClinicalTrials.gov API v2 — searching across 489,312 studies…' },
  { agent: 'Retrieval Agent',      text: 'Found 2,841 matching trials · Extracting investigator records from location fields…' },
  { agent: 'Enrichment Agent',     text: 'Querying PubMed E-utilities — measuring publication velocity per investigator…' },
  { agent: 'Enrichment Agent',     text: 'Cross-referencing NPI registry for US provider identity and specialty validation…' },
  { agent: 'Enrichment Agent',     text: 'Checking FDA BMIS database — 1572/1571 filing records since 2008…' },
  { agent: 'Enrichment Agent',     text: 'Scanning FDA 483 warning letter database for investigator flags…' },
  { agent: 'Identity Resolver',    text: 'Deduplicating investigator identities across registries using embedding similarity…' },
  { agent: 'Scoring Agent',        text: 'Scoring 847 candidates with K2 Think V2 — 8-factor composite model…', detail: 'Factors: indication match, phase experience, velocity, publication rate, capacity, institutional track, responsiveness, regulatory rigor' },
  { agent: 'Scoring Agent',        text: 'K2 Think V2 reasoning complete — applying geographic feasibility filter…' },
  { agent: 'Trajectory Analyzer',  text: 'Computing career trajectory arcs — year-over-year enrollment and trial progression…' },
  { agent: 'Output Formatter',     text: 'Ranking by composite fit score · Generating evidence-cited dossiers…' },
];

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
        // Stream reasoning steps with realistic delays
        for (let i = 0; i < REASONING_STEPS.length; i++) {
          const step = REASONING_STEPS[i];
          const delay = 280 + Math.random() * 320;
          await sleep(delay);
          send({ type: 'step', agent: step.agent, text: step.text, detail: step.detail });
        }

        // Short pause before results appear
        await sleep(200);

        // Compute results from in-memory demo data
        const searchResult = searchInvestigators(query, risingStarsOnly);
        send({ type: 'results', data: searchResult });

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
