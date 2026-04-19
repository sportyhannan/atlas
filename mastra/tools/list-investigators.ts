import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getInvestigators } from "@/lib/data/investigator";

const investigatorSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  site_name: z.string(),
  site_location: z.string().nullable(),
  focus: z.array(z.string()),
  fit_score: z.number(),
  status: z.string(),
});

export const listInvestigatorsTool = createTool({
  id: "list-investigators",
  description:
    "List all investigators from the public.investigators hub table, ordered by fit_score desc. Returns summary rows used to shortlist candidates before fetching full profiles.",
  inputSchema: z.object({}),
  outputSchema: z.array(investigatorSummarySchema),
  execute: async () => {
    const rows = await getInvestigators();
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      site_name: r.site_name,
      site_location: r.site_location,
      focus: r.focus,
      fit_score: r.fit_score,
      status: r.status,
    }));
  },
});
