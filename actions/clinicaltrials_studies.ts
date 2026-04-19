"use server";

import { getClinicaltrialsStudies } from "@/lib/data/clinicaltrials_studies";

export async function fetchClinicaltrialsStudies() {
  return getClinicaltrialsStudies();
}
