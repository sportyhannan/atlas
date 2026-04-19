import { z } from "zod";

export const searchFiltersSchema = z.object({
  indications: z.array(z.string()).default([]),
  phase: z.enum(["1", "2", "3", "4"]).optional(),
  region: z.string().optional(),
  requireUsCredential: z.boolean().default(false),
  minFitScore: z.number().min(0).max(100).default(0),
  limit: z.number().int().min(1).max(25).default(10),
});

export type SearchFilters = z.infer<typeof searchFiltersSchema>;

export const candidateSchema = z.object({
  id: z.string(),
  name: z.string(),
  reason: z.string(),
  supporting_signals: z.array(z.string()),
});

export type Candidate = z.infer<typeof candidateSchema>;

export const candidateListSchema = z.object({
  candidates: z.array(candidateSchema),
});
