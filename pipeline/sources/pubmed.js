/**
 * PubMed — publication history by author + institution
 * Docs: https://www.ncbi.nlm.nih.gov/books/NBK25501/ (E-utilities)
 *
 * Strategy: search by (author name) AND (institution affiliation).
 * Rate limit: 10 req/s with API key, 3/s without.
 * Get a free key at: https://www.ncbi.nlm.nih.gov/account/
 */

const BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const API_KEY = process.env.PUBMED_API_KEY ?? ""; // optional but recommended
const DELAY_MS = API_KEY ? 100 : 350; // respect rate limits

/**
 * Fetch publication metrics for a candidate.
 * @param {string} name       - "Lastname Firstname" or "Lastname F"
 * @param {string} institution - e.g. "Johns Hopkins University"
 * @returns {object} publication metrics
 */
export async function fetchPublicationMetrics(name, institution) {
  const query = buildQuery(name, institution);
  const pmids = await searchPubMed(query);

  if (pmids.length === 0) return emptyMetrics();

  const articles = await fetchArticleDetails(pmids);
  return computeMetrics(articles);
}

function buildQuery(name, institution) {
  // PubMed affiliation search is broad — combine with author for precision
  const namePart = `"${name}"[Author]`;
  const affPart = institution
    ? `"${institution}"[Affiliation]`
    : null;
  return affPart ? `${namePart} AND ${affPart}` : namePart;
}

async function searchPubMed(query, retmax = 200) {
  await sleep(DELAY_MS);
  const params = new URLSearchParams({
    db: "pubmed",
    term: query,
    retmax,
    retmode: "json",
    usehistory: "y",
    ...(API_KEY && { api_key: API_KEY }),
  });

  const res = await fetch(`${BASE}/esearch.fcgi?${params}`);
  if (!res.ok) throw new Error(`PubMed search error: ${res.status}`);
  const data = await res.json();
  return data.esearchresult?.idlist ?? [];
}

async function fetchArticleDetails(pmids) {
  await sleep(DELAY_MS);
  const params = new URLSearchParams({
    db: "pubmed",
    id: pmids.join(","),
    retmode: "json",
    rettype: "abstract",
    ...(API_KEY && { api_key: API_KEY }),
  });

  const res = await fetch(`${BASE}/efetch.fcgi?${params}`);
  if (!res.ok) throw new Error(`PubMed fetch error: ${res.status}`);
  const data = await res.json();
  return Object.values(data.PubmedArticle ?? {});
}

function computeMetrics(articles) {
  const now = new Date().getFullYear();
  const byYear = {};
  const journals = new Set();
  const coAuthors = new Set();

  for (const article of articles) {
    const medline = article.MedlineCitation;
    if (!medline) continue;

    const year = parseInt(
      medline.Article?.Journal?.JournalIssue?.PubDate?.Year ?? "0"
    );
    if (year > 0) byYear[year] = (byYear[year] ?? 0) + 1;

    const journal = medline.Article?.Journal?.Title;
    if (journal) journals.add(journal);

    const authors = medline.Article?.AuthorList?.Author ?? [];
    for (const a of authors) {
      const key = `${a.LastName ?? ""} ${a.ForeName ?? ""}`.trim();
      if (key) coAuthors.add(key);
    }
  }

  const recentYears = [now - 1, now - 2, now - 3];
  const pubsLast3Yrs = recentYears.reduce((sum, y) => sum + (byYear[y] ?? 0), 0);

  return {
    totalPublications: articles.length,
    pubsLast3Years: pubsLast3Yrs,
    pubsPerYear: byYear,
    uniqueJournals: journals.size,
    coAuthorCount: coAuthors.size,
    // Simple research output score (0–100)
    researchOutputScore: scoreResearchOutput(articles.length, pubsLast3Yrs),
  };
}

function scoreResearchOutput(total, recent) {
  // Benchmarks tuned for MD/PhD trainees (not attendings)
  const totalScore = Math.min(total / 10, 1) * 50;   // 10+ pubs = max
  const recentScore = Math.min(recent / 4, 1) * 50;  // 4+ in last 3yr = max
  return Math.round(totalScore + recentScore);
}

function emptyMetrics() {
  return {
    totalPublications: 0,
    pubsLast3Years: 0,
    pubsPerYear: {},
    uniqueJournals: 0,
    coAuthorCount: 0,
    researchOutputScore: 0,
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
