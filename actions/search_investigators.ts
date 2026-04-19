"use server";

import { openai } from "@ai-sdk/openai";
import { queryPlannerAgent } from "@/mastra/agents/query-planner-agent";
import { investigatorSearchAgent } from "@/mastra/agents/investigator-search-agent";
import {
  searchFiltersSchema,
  candidateListSchema,
  type SearchFilters,
  type Candidate,
} from "@/mastra/tools/search-filters";

export type InvestigatorSearchResult = {
  filters: SearchFilters;
  candidates: Candidate[];
};

const structuringModel = openai("gpt-4o-mini");

export async function searchInvestigators(
  query: string,
): Promise<InvestigatorSearchResult> {
  const plan = await queryPlannerAgent.generate(query, {
    structuredOutput: { schema: searchFiltersSchema },
  });
  const filters = searchFiltersSchema.parse(plan.object);

  const result = await investigatorSearchAgent.generate(
    `Find investigators matching these filters:\n${JSON.stringify(filters, null, 2)}`,
    {
      structuredOutput: {
        schema: candidateListSchema,
        model: structuringModel,
      },
      maxSteps: 20,
    },
  );

  return { filters, candidates: result.object?.candidates ?? [] };
}
