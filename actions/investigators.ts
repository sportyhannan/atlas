"use server";

import { getInvestigators } from "@/lib/investigators";

export async function fetchInvestigators() {
  return getInvestigators();
}
