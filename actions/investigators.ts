"use server";

import { getInvestigators } from "@/lib/data/investigator";

export async function fetchInvestigators() {
  return getInvestigators();
}
