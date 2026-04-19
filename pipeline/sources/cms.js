/**
 * CMS NPI Registry + Open Payments — mentor clinical volume
 * 
 * NPI Registry docs: https://npiregistry.cms.hhs.gov/api-page
 * Open Payments docs: https://openpaymentsdata.cms.gov/api-docs
 *
 * Strategy: given a mentor/PI name + institution, look up their NPI,
 * then use Open Payments to estimate research industry engagement
 * (a proxy for trial experience and pharma relationships).
 * 
 * Note: direct patient volume requires Medicare Part B claims data
 * (bulk download from CMS). The NPI lookup here gives you credentials
 * and specialty; Open Payments gives research payment history.
 */

const NPI_API = "https://npiregistry.cms.hhs.gov/api";
const OPEN_PAYMENTS_API = "https://openpaymentsdata.cms.gov/api/1/datastore/sql";
const DELAY_MS = 150;

/**
 * Look up a mentor/PI's NPI and clinical profile.
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} state - 2-letter code, e.g. "MD"
 */
export async function fetchMentorNPI(firstName, lastName, state = null) {
  await sleep(DELAY_MS);

  const params = new URLSearchParams({
    version: "2.1",
    first_name: firstName,
    last_name: lastName,
    limit: 5,
    ...(state && { state }),
  });

  const res = await fetch(`${NPI_API}?${params}`);
  if (!res.ok) throw new Error(`NPI Registry error: ${res.status}`);
  const data = await res.json();

  const results = data.results ?? [];
  if (results.length === 0) return null;

  // Take first result; refine with institution match if multiple
  const provider = results[0];
  return normalizeNPI(provider);
}

/**
 * Fetch Open Payments research data for a provider by NPI.
 * This captures industry-sponsored research payments — a proxy for
 * the mentor's existing pharma/biotech relationships.
 */
export async function fetchMentorOpenPayments(npi) {
  await sleep(DELAY_MS);

  // Open Payments uses a SQL-like query interface
  // research_payment_2023 is the most recent annual dataset
  const query = `
    [SELECT physician_npi, physician_specialty, total_amount_invested_usdollars,
            name_of_study, record_id
     FROM research_payment_2023
     WHERE physician_npi = '${npi}'
     LIMIT 50]
  `.trim();

  const params = new URLSearchParams({ query });
  const res = await fetch(`${OPEN_PAYMENTS_API}?${params}`);
  if (!res.ok) return emptyPayments();
  const data = await res.json();

  return computePaymentMetrics(data);
}

/**
 * Convenience: fetch both NPI and Open Payments in one call.
 */
export async function fetchMentorProfile(firstName, lastName, state = null) {
  const npiRecord = await fetchMentorNPI(firstName, lastName, state);
  if (!npiRecord) return { found: false };

  const payments = await fetchMentorOpenPayments(npiRecord.npi);

  return {
    found: true,
    ...npiRecord,
    openPayments: payments,
    // Combined clinical exposure score (proxy for patient volume + trial engagement)
    clinicalExposureScore: scoreClinicalExposure(npiRecord, payments),
  };
}

function normalizeNPI(provider) {
  const basic = provider.basic ?? {};
  const taxonomies = provider.taxonomies ?? [];
  const primaryTaxonomy = taxonomies.find((t) => t.primary) ?? taxonomies[0] ?? {};
  const addresses = provider.addresses ?? [];
  const practiceAddr = addresses.find((a) => a.address_purpose === "LOCATION") ?? addresses[0] ?? {};

  return {
    npi: provider.number,
    name: `${basic.first_name ?? ""} ${basic.last_name ?? ""}`.trim(),
    credential: basic.credential ?? null,
    specialty: primaryTaxonomy.desc ?? null,
    taxonomyCode: primaryTaxonomy.code ?? null,
    organizationName: practiceAddr.organization_name ?? null,
    state: practiceAddr.state ?? null,
    city: practiceAddr.city ?? null,
    // Enumeration date as a proxy for years in practice
    enumerationDate: basic.enumeration_date ?? null,
    yearsInPractice: estimateYearsInPractice(basic.enumeration_date),
  };
}

function computePaymentMetrics(data) {
  const records = Array.isArray(data) ? data : [];
  const totalResearchInvestment = records.reduce(
    (sum, r) => sum + parseFloat(r.total_amount_invested_usdollars ?? 0), 0
  );
  const studyNames = [...new Set(records.map((r) => r.name_of_study).filter(Boolean))];

  return {
    researchPaymentCount: records.length,
    totalResearchInvestmentUSD: Math.round(totalResearchInvestment),
    uniqueStudies: studyNames.length,
    studyNames: studyNames.slice(0, 5),
  };
}

function scoreClinicalExposure(npiRecord, payments) {
  // Specialty weighting: procedural/patient-facing specialties score higher
  const HIGH_VALUE_SPECIALTIES = [
    "oncology", "neurology", "cardiology", "internal medicine",
    "pulmonology", "gastroenterology", "rheumatology", "hematology",
  ];
  const specialty = (npiRecord.specialty ?? "").toLowerCase();
  const specialtyBonus = HIGH_VALUE_SPECIALTIES.some((s) => specialty.includes(s)) ? 20 : 0;

  // Research engagement via Open Payments
  const engagementScore = Math.min(payments.uniqueStudies / 5, 1) * 50;

  // Years in practice (longer = larger panel, more patients)
  const tenureScore = Math.min((npiRecord.yearsInPractice ?? 0) / 15, 1) * 30;

  return Math.round(specialtyBonus + engagementScore + tenureScore);
}

function estimateYearsInPractice(enumerationDate) {
  if (!enumerationDate) return null;
  const year = parseInt(enumerationDate.split("-")[0]);
  return isNaN(year) ? null : new Date().getFullYear() - year;
}

function emptyPayments() {
  return {
    researchPaymentCount: 0,
    totalResearchInvestmentUSD: 0,
    uniqueStudies: 0,
    studyNames: [],
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
