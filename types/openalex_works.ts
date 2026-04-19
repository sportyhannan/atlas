export type openalex_works = {
  id: string;
  openalex_id: string | null;
  doi: string | null;
  pubmed_id: string | null;
  title: string | null;
  pub_year: number | null;
  journal_name: string | null;
  cited_by_count: number | null;
  author_openalex_ids: string[] | null;
  concepts: unknown;
  ingested_at: string;
};
