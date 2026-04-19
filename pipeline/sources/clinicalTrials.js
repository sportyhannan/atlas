/**
 * ClinicalTrials.gov API v2 — institutional trial portfolio
 * Docs: https://clinicaltrials.gov/data-api/api
 *
 * Strategy: look up the candidate's institution as a trial site,
 * then count active/recent trials and derive an infrastructure score.
 * Also check if the candidate themselves appears as an investigator.
 */

const BASE = "https://clinicaltrials.gov/api/v2";
const DELAY_MS = 200; // public API, be conservative

/**
 * Fetch trial infrastructure data for a given institution.
 * @param {string} institution - e.g. "Johns Hopkins University"
 * @returns {object} site-level trial metrics
 */
export async function fetchInstitutionTrialData(institution) {
  await sleep(DELAY_MS);

  const params = new URLSearchParams({
    "query.locn": institution,
    "filter.overallStatus": "RECRUITING,ACTIVE_NOT_RECRUITING,ENROLLING_BY_INVITATION",
    "fields": "NCTId,BriefTitle,Phase,Condition,OverallStatus,StartDate,LeadSponsorName,ResponsiblePartyInvestigatorFullName",
    "pageSize": 100,
    "format": "json",
  });

  const res = await fetch(`${BASE}/studies?${params}`);
  if (!res.ok) throw new Error(`ClinicalTrials.gov error: ${res.status}`);
  const data = await res.json();

  const studies = data.studies ?? [];
  return computeSiteMetrics(studies, institution);
}

/**
 * Check if a named investigator appears as PI on any trials.
 * Useful for mentors and for confirming the candidate's own involvement.
 */
export async function fetchInvestigatorTrials(investigatorName) {
  await sleep(DELAY_MS);

  const params = new URLSearchParams({
    "query.intr": investigatorName, // searches investigator names
    "filter.overallStatus": "RECRUITING,ACTIVE_NOT_RECRUITING,COMPLETED",
    "fields": "NCTId,BriefTitle,Phase,Condition,OverallStatus,ResponsiblePartyInvestigatorFullName",
    "pageSize": 50,
    "format": "json",
  });

  const res = await fetch(`${BASE}/studies?${params}`);
  if (!res.ok) return { trialCount: 0, phases: [], conditions: [] };
  const data = await res.json();

  const studies = data.studies ?? [];
  return {
    trialCount: studies.length,
    phases: [...new Set(studies.map((s) => s.protocolSection?.designModule?.phases?.[0]).filter(Boolean))],
    conditions: [...new Set(studies.flatMap((s) => s.protocolSection?.conditionsModule?.conditions ?? []))].slice(0, 10),
  };
}

function computeSiteMetrics(studies, institution) {
  const phases = {};
  const conditions = new Set();
  const sponsors = new Set();

  for (const study of studies) {
    const proto = study.protocolSection ?? {};
    const phase = proto.designModule?.phases?.[0] ?? "N/A";
    phases[phase] = (phases[phase] ?? 0) + 1;

    for (const c of proto.conditionsModule?.conditions ?? []) conditions.add(c);
    const sponsor = proto.sponsorCollaboratorsModule?.leadSponsor?.name;
    if (sponsor) sponsors.add(sponsor);
  }

  const activeTrialCount = studies.length;
  const phase2Plus = (phases["PHASE2"] ?? 0) + (phases["PHASE3"] ?? 0) + (phases["PHASE4"] ?? 0);

  return {
    institution,
    activeTrialCount,
    phase2PlusCount: phase2Plus,
    phaseBreakdown: phases,
    topConditions: [...conditions].slice(0, 10),
    uniqueSponsors: sponsors.size,
    // Infrastructure readiness score (0–100)
    infrastructureScore: scoreInfrastructure(activeTrialCount, phase2Plus, sponsors.size),
  };
}

function scoreInfrastructure(active, phase2Plus, sponsors) {
  // 20+ active trials at a site = well-resourced; Phase 2+ = capable of complex protocols
  const volumeScore = Math.min(active / 20, 1) * 40;
  const phaseScore = Math.min(phase2Plus / 5, 1) * 40;
  const diversityScore = Math.min(sponsors / 10, 1) * 20;
  return Math.round(volumeScore + phaseScore + diversityScore);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
