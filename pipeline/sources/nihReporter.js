/**
 * NIH RePORTER — F30 grant query
 * Docs: https://api.reporter.nih.gov/
 *
 * F30 = MD/PhD (MSTP) fellowship grants. This is the cleanest
 * single list of funded MD/PhD trainees in the US.
 */

const NIH_API = "https://api.reporter.nih.gov/v2/projects/search";

/**
 * Fetch all active F30 grants, paginated.
 * Returns an array of candidate records.
 */
export async function fetchF30Candidates({ fiscalYears = [2022, 2023, 2024], limit = 500 } = {}) {
  const candidates = [];
  let offset = 0;
  let total = null;

  while (total === null || offset < total) {
    const body = {
      criteria: {
        activity_codes: ["F30"],
        fiscal_years: fiscalYears,
        // Exclude expired/terminated
        project_nums: null,
      },
      include_fields: [
        "ProjectNum",
        "ContactPiName",
        "Organization",
        "ProjectTitle",
        "AbstractText",
        "FiscalYear",
        "AwardAmount",
        "ProjectStartDate",
        "ProjectEndDate",
      ],
      offset,
      limit,
      sort_field: "fiscal_year",
      sort_order: "desc",
    };

    const res = await fetch(NIH_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`NIH RePORTER error: ${res.status}`);
    const data = await res.json();

    if (total === null) total = data.meta.total;

    for (const project of data.results) {
      candidates.push(normalizeNIH(project));
    }

    offset += limit;
    if (data.results.length < limit) break; // last page
  }

  return candidates;
}

function normalizeNIH(project) {
  // NIH API returns snake_case field names
  const org = project.organization ?? {};
  return {
    source: "nih_reporter",
    sourceId: project.project_num ?? null,
    name: project.contact_pi_name ?? null,
    orcid: null, // ORCID not provided in standard F30 response
    institution: org.org_name ?? null,
    city: org.org_city ?? null,
    state: org.org_state ?? null,
    projectTitle: project.project_title ?? null,
    abstract: project.abstract_text ?? null,
    fiscalYear: project.fiscal_year ?? null,
    grantType: "F30",
    // Use this to infer specialty/indication alignment later
    researchTopics: extractTopics(project.abstract_text),
  };
}

// Lightweight keyword extractor for indication alignment (Stage 3)
function extractTopics(abstract) {
  if (!abstract) return [];
  const terms = [
    "oncology", "cancer", "tumor",
    "neurology", "neurodegeneration", "alzheimer",
    "cardiology", "cardiovascular",
    "immunology", "autoimmune",
    "infectious disease", "virology",
    "diabetes", "endocrinology",
    "rare disease", "orphan",
  ];
  const lower = abstract.toLowerCase();
  return terms.filter(t => lower.includes(t));
}
