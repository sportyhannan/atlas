"use server";

import { getFdaBmis } from "@/lib/data/fda_bmis";

export async function fetchFdaBmis() {
  return getFdaBmis();
}
