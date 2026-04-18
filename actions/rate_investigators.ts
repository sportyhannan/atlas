"use server";

import { z } from "zod";
import { ratingAgent } from "@/mastra/agents/rating-agent";

const ratingSchema = z.object({
  rating: z.number().int().min(0).max(100),
  reason: z.string(),
});

export type InvestigatorRating = z.infer<typeof ratingSchema>;

export async function rateInvestigator(
  id: string,
): Promise<InvestigatorRating> {
  const result = await ratingAgent.generate(
    `Rate the investigator whose id is ${id}.`,
    { structuredOutput: { schema: ratingSchema } },
  );

  return result.object;
}
