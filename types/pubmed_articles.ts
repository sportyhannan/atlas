export type pubmed_articles = {
  id: string;
  pubmed_id: string | null;
  doi: string | null;
  title: string | null;
  abstract: string | null;
  journal: string | null;
  volume: string | null;
  issue: string | null;
  pub_date: string | null;
  pub_year: number | null;
  authors_raw: unknown;
  mesh_terms: string[] | null;
  indication_tags: string[] | null;
  citation_count: number | null;
  resolved_author_ids: string[] | null;
  ingested_at: string;
};
