"use server";

import { getClinicaltrialsInvestigators } from "@/lib/data/clinicaltrials_investigators";

export async function fetchClinicaltrialsInvestigators() {
  return getClinicaltrialsInvestigators();
}
