/**
 * pipeline/index.js — Main orchestrator
 *
 * Runs all five sources in sequence per candidate and produces
 * a scored, ranked output list.
 *
 * Usage:
 *   node pipeline/index.js
 *
 * Or import and call run() programmatically.
 */

import { fetchF30Candidates } from "./sources/nihReporter.js";
import { fetchPublicationMetrics } from "./sources/pubmed.js";
import { enrichWithORCID } from "./sources/orcid.js";
import { fetchInstitutionTrialData, fetchInvestigatorTrials } from "./sources/clinicalTrials.js";
import { fetchMentorProfile } from "./sources/cms.js";
import { writeFile } from "fs/promises";

// ─── Config ──────────────────────────────────────────────────────────────────

const CONFIG = {
  fiscalYears: [2022, 2023, 2024],

  // Score weights (must sum to 1.0)
  weights: {
    researchOutput: 0.40,
    clinicalExposure: 0.35,
    institutionalReadiness: 0.25,
  },

  // Min score (0–100) to include in output
  scoreThreshold: 30,
};

// ─── Orchestrator ─────────────────────────────────────────────────────────────

export async function run() {
  console.log("Step 1/4 — Fetching F30 candidates from NIH RePORTER...");
  const rawCandidates = await fetchF30Candidates({ fiscalYears: CONFIG.fiscalYears });
  console.log(`  Found ${rawCandidates.length} F30 grant holders.`);

  console.log("Step 2/4 — Enriching candidates...");
  const enriched = [];
  for (const [i, candidate] of rawCandidates.entries()) {
    process.stdout.write(`  [${i + 1}/${rawCandidates.length}] ${candidate.name}...`);
    try {
      const record = await enrichCandidate(candidate);
      enriched.push(record);
      process.stdout.write(" done\n");
    } catch (err) {
      process.stdout.write(` error: ${err.message}\n`);
      enriched.push({ ...candidate, enrichmentError: err.message });
    }
  }

  console.log("Step 3/4 — Scoring...");
  const scored = enriched
    .map(scoreCandidate)
    .filter((c) => c.compositeScore >= CONFIG.scoreThreshold)
    .sort((a, b) => b.compositeScore - a.compositeScore);

  console.log(`Step 4/4 — Done. ${scored.length} candidates above threshold.`);
  return scored;
}

// ─── Per-candidate enrichment ─────────────────────────────────────────────────

async function enrichCandidate(candidate) {
  const [name, institution] = [candidate.name, candidate.institution];

  // Run independent lookups in parallel where safe
  const [orcidData, pubmedData, siteData] = await Promise.all([
    enrichWithORCID(candidate).catch(() => ({ orcidFound: false })),
    fetchPublicationMetrics(name, institution).catch(() => null),
    fetchInstitutionTrialData(institution).catch(() => null),
  ]);

  // Investigator-level trial check (sequential — depends on name)
  const investigatorTrials = await fetchInvestigatorTrials(name).catch(() => null);

  // Mentor lookup: extract PI name from grant title heuristic or skip
  // In practice, you'd parse the abstract for advisor acknowledgements
  const mentorProfile = null; // placeholder — wire in when mentor name is known

  return {
    ...candidate,
    orcid: orcidData,
    publications: pubmedData,
    institutionTrials: siteData,
    investigatorTrials,
    mentorProfile,
    dataCompleteness: computeDataCompleteness({ orcidData, pubmedData, siteData }),
  };
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

function scoreCandidate(candidate) {
  const researchScore = candidate.publications?.researchOutputScore ?? 0;

  // Clinical exposure: mix of investigator trial history + institution readiness
  const trialSiteScore = candidate.institutionTrials?.infrastructureScore ?? 0;
  const investigatorTrialBonus = Math.min((candidate.investigatorTrials?.trialCount ?? 0) * 10, 20);
  const clinicalScore = Math.min(trialSiteScore + investigatorTrialBonus, 100);

  const institutionalScore = candidate.institutionTrials?.infrastructureScore ?? 0;

  const w = CONFIG.weights;
  const compositeScore = Math.round(
    researchScore * w.researchOutput +
    clinicalScore * w.clinicalExposure +
    institutionalScore * w.institutionalReadiness
  );

  return {
    // Identity
    name: candidate.name,
    institution: candidate.institution,
    state: candidate.state,
    orcidUrl: candidate.orcid?.profileUrl ?? null,
    grantId: candidate.sourceId,
    fiscalYear: candidate.fiscalYear,
    researchTopics: candidate.researchTopics ?? [],

    // Scores
    compositeScore,
    breakdown: {
      researchOutput: researchScore,
      clinicalExposure: clinicalScore,
      institutionalReadiness: institutionalScore,
    },

    // Key signals for analyst review
    signals: {
      totalPublications: candidate.publications?.totalPublications ?? null,
      pubsLast3Years: candidate.publications?.pubsLast3Years ?? null,
      activeTrialsAtSite: candidate.institutionTrials?.activeTrialCount ?? null,
      phase2PlusTrials: candidate.institutionTrials?.phase2PlusCount ?? null,
      investigatorTrialCount: candidate.investigatorTrials?.trialCount ?? null,
    },

    // Flag incomplete records for manual review
    dataCompleteness: candidate.dataCompleteness,
    needsReview: candidate.dataCompleteness < 0.6,
  };
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function computeDataCompleteness({ orcidData, pubmedData, siteData }) {
  const checks = [
    orcidData?.orcidFound === true,
    pubmedData?.totalPublications > 0,
    siteData?.activeTrialCount > 0,
  ];
  return checks.filter(Boolean).length / checks.length;
}

// ─── CLI entry point ──────────────────────────────────────────────────────────

if (process.argv[1].endsWith("index.js")) {
  run()
    .then(async (results) => {
      console.log("\n── Top 10 candidates ──");
      for (const c of results.slice(0, 10)) {
        console.log(
          `${c.compositeScore.toString().padStart(3)}  ${c.name}  (${c.institution})`
        );
      }
      // Write full output to JSON
      await writeFile("candidates_output.json", JSON.stringify(results, null, 2));
      console.log(`\nFull results saved to candidates_output.json`);
    })
    .catch((err) => {
      console.error("Pipeline failed:", err);
      process.exit(1);
    });
}
