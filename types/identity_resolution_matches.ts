export type identity_resolution_matches = {
  id: string;
  investigator_id: string | null;
  source_table: string | null;
  source_record_id: string | null;
  confidence: number | null;
  match_method: string | null;
  resolved_at: string;
};
