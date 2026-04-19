export type cms_open_payments = {
  id: string;
  record_id: string | null;
  payment_year: number | null;
  covered_recipient_type: string | null;
  physician_npi: string | null;
  physician_name_first: string | null;
  physician_name_last: string | null;
  physician_specialty: string | null;
  recipient_state: string | null;
  recipient_country: string | null;
  paying_entity: string | null;
  nature_of_payment: string | null;
  total_amount: number | null;
  payment_form: string | null;
  drug_or_biological_name: string | null;
  resolved_investigator_id: string | null;
  ingested_at: string;
};
