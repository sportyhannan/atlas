"use server";

import { z } from "zod";
import { ratingAgent } from "@/mastra/agents/rating-agent";
import { getInvestigatorById } from "@/lib/investigators";

const ratingSchema = z.object({
  rating: z.number().int().min(0).max(100),
  reason: z.string(),
});

export type InvestigatorRating = z.infer<typeof ratingSchema>;

export async function rateInvestigator(
  id: string,
): Promise<InvestigatorRating> {
  const row = await getInvestigatorById(id);
  if (!row) throw new Error(`investigator ${id} not found`);

  const result = await ratingAgent.generate(
    `Rate the investigator whose id is ${id}.`,
    { structuredOutput: { schema: ratingSchema } },
  );

  return result.object;
}
