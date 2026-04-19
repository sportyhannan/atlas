"use server";

import { createClient } from "@/utils/supabase/server";
import type { RisingStar } from "@/types/rising-star";
import { mockRisingStars } from "./mock-rising-stars";

/**
 * Fetch rising star candidates from Supabase
 * Falls back to mock data if table doesn't exist yet
 */
export async function getRisingStars(): Promise<RisingStar[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rising_stars")
    .select("*")
    .order("composite_score", { ascending: false });

  if (error) {
    console.warn("Supabase table not found, using mock data:", error.message);
    console.warn("Run 'node pipeline/index.js' and upload data to see real candidates");
    return mockRisingStars;
  }

  // Transform snake_case database fields to camelCase for TypeScript
  const transformed = (data || []).map((row: any) => ({
    name: row.name,
    institution: row.institution,
    state: row.state,
    orcidUrl: row.orcid_url,
    grantId: row.grant_id,
    fiscalYear: row.fiscal_year,
    researchTopics: row.research_topics || [],
    compositeScore: row.composite_score,
    breakdown: {
      researchOutput: row.research_output_score,
      clinicalExposure: row.clinical_exposure_score,
      institutionalReadiness: row.institutional_readiness_score,
    },
    signals: {
      totalPublications: row.total_publications,
      pubsLast3Years: row.pubs_last_3_years,
      activeTrialsAtSite: row.active_trials_at_site,
      phase2PlusTrials: row.phase_2_plus_trials,
      investigatorTrialCount: row.investigator_trial_count,
    },
    dataCompleteness: row.data_completeness,
    needsReview: row.needs_review,
  }));

  return transformed;
}
