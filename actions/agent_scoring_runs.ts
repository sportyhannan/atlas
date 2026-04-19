"use server";

import { getAgentScoringRuns } from "@/lib/data/agent_scoring_runs";

export async function fetchAgentScoringRuns() {
  return getAgentScoringRuns();
}
