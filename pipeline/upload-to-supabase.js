/**
 * Upload pipeline results to Supabase
 *
 * Usage:
 *   1. Run the pipeline: node pipeline/index.js
 *   2. Upload results: node pipeline/upload-to-supabase.js candidates_output.json
 *
 * Prerequisites:
 *   - Create the rising_stars table in Supabase (see schema below)
 *   - Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env vars
 */

import { readFile } from "fs/promises";
import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Missing Supabase credentials");
  console.error("Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadRisingStars(filePath) {
  console.log(`Reading data from ${filePath}...`);
  const data = JSON.parse(await readFile(filePath, "utf-8"));

  console.log(`Found ${data.length} rising star candidates`);

  // Transform data to match Supabase schema
  const records = data.map((star) => ({
    name: star.name,
    institution: star.institution,
    state: star.state,
    orcid_url: star.orcidUrl,
    grant_id: star.grantId,
    fiscal_year: star.fiscalYear,
    research_topics: star.researchTopics,
    composite_score: star.compositeScore,
    research_output_score: star.breakdown.researchOutput,
    clinical_exposure_score: star.breakdown.clinicalExposure,
    institutional_readiness_score: star.breakdown.institutionalReadiness,
    total_publications: star.signals.totalPublications,
    pubs_last_3_years: star.signals.pubsLast3Years,
    active_trials_at_site: star.signals.activeTrialsAtSite,
    phase_2_plus_trials: star.signals.phase2PlusTrials,
    investigator_trial_count: star.signals.investigatorTrialCount,
    data_completeness: star.dataCompleteness,
    needs_review: star.needsReview,
  }));

  // Clear existing data
  console.log("Clearing existing data...");
  const { error: deleteError } = await supabase
    .from("rising_stars")
    .delete()
    .neq("grant_id", ""); // Delete all records

  if (deleteError) {
    console.error("Error clearing data:", deleteError);
  }

  // Upload in batches of 100
  const batchSize = 100;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    console.log(`Uploading batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)}...`);

    const { error } = await supabase
      .from("rising_stars")
      .insert(batch);

    if (error) {
      console.error(`Error uploading batch ${i / batchSize + 1}:`, error);
      process.exit(1);
    }
  }

  console.log(`✅ Successfully uploaded ${records.length} rising star candidates!`);
}

// CLI entry point
const filePath = process.argv[2] || "candidates_output.json";
uploadRisingStars(filePath).catch((err) => {
  console.error("Upload failed:", err);
  process.exit(1);
});

/**
 * Supabase SQL Schema:
 *
 * CREATE TABLE rising_stars (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   institution TEXT,
 *   state TEXT,
 *   orcid_url TEXT,
 *   grant_id TEXT NOT NULL UNIQUE,
 *   fiscal_year INTEGER,
 *   research_topics TEXT[],
 *   composite_score INTEGER NOT NULL,
 *   research_output_score INTEGER,
 *   clinical_exposure_score INTEGER,
 *   institutional_readiness_score INTEGER,
 *   total_publications INTEGER,
 *   pubs_last_3_years INTEGER,
 *   active_trials_at_site INTEGER,
 *   phase_2_plus_trials INTEGER,
 *   investigator_trial_count INTEGER,
 *   data_completeness NUMERIC,
 *   needs_review BOOLEAN DEFAULT false,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * -- Create indexes for common queries
 * CREATE INDEX idx_rising_stars_composite_score ON rising_stars(composite_score DESC);
 * CREATE INDEX idx_rising_stars_needs_review ON rising_stars(needs_review);
 * CREATE INDEX idx_rising_stars_institution ON rising_stars(institution);
 * CREATE INDEX idx_rising_stars_fiscal_year ON rising_stars(fiscal_year DESC);
 */
