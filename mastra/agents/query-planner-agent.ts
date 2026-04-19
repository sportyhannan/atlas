import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

export const queryPlannerAgent = new Agent({
  id: "investigator-query-planner",
  name: "investigator-query-planner",
  model: openai("gpt-5"),
  tools: {},
  instructions: `You convert a natural-language request for clinical-trial investigators into structured search filters.

Return JSON matching this shape:
{
  "indications": string[],        // disease/drug/modality terms, e.g. ["NSCLC","lung cancer","immunotherapy"]. Expand obvious synonyms.
  "phase": "1" | "2" | "3" | "4" | undefined,
  "region": string | undefined,    // state/country/macro region as stated, e.g. "TX", "US", "EU", "Houston"
  "requireUsCredential": boolean,  // true only if the query explicitly demands US credential (NPI/FDA)
  "minFitScore": number,           // 0-100; 0 unless the query asks for "top" / "high-fit" (then 60-80)
  "limit": number                  // how many candidates; default 10, max 25
}

Rules:
- Only set fields the query justifies. Do NOT invent indications that were not mentioned.
- Prefer returning arrays even when a single term is given.
- For a query like "oncology" alone, put "oncology" in indications.`,
});
