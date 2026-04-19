export type fda_483_letters = {
  id: string;
  subject: string | null;
  company_name: string | null;
  issuing_office: string | null;
  letter_date: string | null;
  letter_url: string | null;
  letter_type: string | null;
  investigator_names_extracted: string[] | null;
  observations: string[] | null;
  resolved_investigator_ids: string[] | null;
  ingested_at: string;
};
