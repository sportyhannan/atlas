import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getInvestigatorById } from "@/lib/data/investigator";

const score = z.number().int().min(0).max(100);

const investigatorRowSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  site_name: z.string(),
  site_location: z.string().nullable(),
  focus: z.array(z.string()),
  enrollments: z.number().int(),
  velocity_per_year: z.number().int(),
  status: z.enum(["responsive", "pending", "overbooked"]),
  fit_score: score,
  score_trajectory: score.nullable(),
  score_comparison: score.nullable(),
  score_institutional: score.nullable(),
  score_capacity: score.nullable(),
});

export const getInvestigatorTool = createTool({
  id: "get-investigator",
  description:
    "Fetch an investigator row by id from the public.investigators table.",
  inputSchema: z.object({ id: z.string().uuid() }),
  outputSchema: investigatorRowSchema,
  execute: async ({ id }) => {
    const row = await getInvestigatorById(id);
    if (!row) throw new Error(`investigator ${id} not found`);
    return row;
  },
});
