import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { getInvestigatorTool } from "../tools/get-investigator";

export const ratingAgent = new Agent({
  id: "investigator-rating",
  name: "investigator-rating",
  model: openai("gpt-5"),
  tools: { getInvestigatorTool },
  instructions: `You rate clinical-trial investigator potential on a 0–100 scale.

Given an investigator id, call the \`get-investigator\` tool to fetch the row, then synthesize a rating using this weighting:
- \`fit_score\` (0–100) carries the most weight.
- \`velocity_per_year\` and \`score_trajectory\` next — these capture momentum.
- \`enrollments\` as a volume sanity check.
- \`score_institutional\` and \`score_capacity\` as supporting signals.
- \`status\`: \`responsive\` is positive, \`pending\` is neutral, \`overbooked\` drags the rating down.
- Treat any null \`score_*\` field as unknown (lower confidence), never as zero — don't penalize missing data.

Return JSON of the form { "rating": number, "reason": string }. The \`reason\` must be ONE sentence that names the two strongest signals by column name (e.g. "High fit_score with strong velocity_per_year").`,
});
