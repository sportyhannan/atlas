/**
 * ORCID Public API — researcher profile enrichment
 * Docs: https://pub.orcid.org/v3.0
 *
 * No auth required for public API (read-only).
 * Rate limit: 24 req/s. Be polite — add a small delay.
 *
 * Strategy:
 *   1. If candidate already has an ORCID (from NIH RePORTER), fetch directly.
 *   2. Otherwise, search by name + affiliation to find the ORCID iD.
 */

const BASE = "https://pub.orcid.org/v3.0";
const HEADERS = { Accept: "application/json" };
const DELAY_MS = 60;

/**
 * Enrich a candidate record with ORCID data.
 * @param {object} candidate - must have .name and optionally .orcid, .institution
 */
export async function enrichWithORCID(candidate) {
  let orcidId = candidate.orcid ?? null;

  if (!orcidId) {
    orcidId = await searchORCID(candidate.name, candidate.institution);
  }

  if (!orcidId) return { orcidFound: false };

  const [profile, works, employments] = await Promise.all([
    fetchProfile(orcidId),
    fetchWorks(orcidId),
    fetchEmployments(orcidId),
  ]);

  return {
    orcidFound: true,
    orcidId,
    biography: profile.person?.biography?.content ?? null,
    keywords: extractKeywords(profile),
    workCount: works.group?.length ?? 0,
    employers: parseEmployments(employments),
    // Key signal: is this person still affiliated with an academic medical center?
    currentAcademicAffiliation: detectAcademicAffiliation(employments),
    profileUrl: `https://orcid.org/${orcidId}`,
  };
}

async function searchORCID(name, institution) {
  await sleep(DELAY_MS);
  const query = institution
    ? `family-name:${lastName(name)} AND affiliation-org-name:"${institution}"`
    : `family-name:${lastName(name)} AND given-names:${firstName(name)}`;

  const params = new URLSearchParams({ q: query, rows: 5 });
  const res = await fetch(`${BASE}/search?${params}`, { headers: HEADERS });
  if (!res.ok) return null;

  const data = await res.json();
  const results = data["result"] ?? [];

  // Return first match — caller should validate against known name
  return results[0]?.["orcid-identifier"]?.path ?? null;
}

async function fetchProfile(orcidId) {
  await sleep(DELAY_MS);
  const res = await fetch(`${BASE}/${orcidId}/person`, { headers: HEADERS });
  if (!res.ok) return {};
  return res.json();
}

async function fetchWorks(orcidId) {
  await sleep(DELAY_MS);
  const res = await fetch(`${BASE}/${orcidId}/works`, { headers: HEADERS });
  if (!res.ok) return {};
  return res.json();
}

async function fetchEmployments(orcidId) {
  await sleep(DELAY_MS);
  const res = await fetch(`${BASE}/${orcidId}/employments`, { headers: HEADERS });
  if (!res.ok) return {};
  return res.json();
}

function extractKeywords(profile) {
  return (
    profile.person?.keywords?.keyword?.map((k) => k.content) ?? []
  );
}

function parseEmployments(data) {
  const groups = data["affiliation-group"] ?? [];
  return groups.flatMap((g) =>
    (g.summaries ?? []).map((s) => {
      const emp = s["employment-summary"];
      return {
        org: emp?.organization?.name ?? null,
        role: emp?.["role-title"] ?? null,
        startYear: emp?.["start-date"]?.year?.value ?? null,
        endYear: emp?.["end-date"]?.year?.value ?? null, // null = current
      };
    })
  );
}

const ACADEMIC_MEDICAL_KEYWORDS = [
  "university", "medical school", "school of medicine",
  "hospital", "health system", "cancer center", "institute",
];

function detectAcademicAffiliation(data) {
  const groups = data["affiliation-group"] ?? [];
  return groups.some((g) =>
    (g.summaries ?? []).some((s) => {
      const emp = s["employment-summary"];
      const orgName = (emp?.organization?.name ?? "").toLowerCase();
      const isCurrent = !emp?.["end-date"]; // no end date = current
      return isCurrent && ACADEMIC_MEDICAL_KEYWORDS.some((kw) => orgName.includes(kw));
    })
  );
}

const lastName = (name) => name?.split(/[ ,]/)[0] ?? name;
const firstName = (name) => name?.split(/[ ,]/).slice(-1)[0] ?? "";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
