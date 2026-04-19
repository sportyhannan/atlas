export type openalex_authors = {
  id: string;
  openalex_id: string | null;
  display_name: string | null;
  orcid: string | null;
  works_count: number | null;
  cited_by_count: number | null;
  h_index: number | null;
  i10_index: number | null;
  last_known_institution_name: string | null;
  last_known_institution_country: string | null;
  concepts: unknown;
  two_year_mean_citedness: number | null;
  resolved_investigator_id: string | null;
  ingested_at: string;
};
