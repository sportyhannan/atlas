"use server";

import { getFda483Letters } from "@/lib/data/fda_483_letters";

export async function fetchFda483Letters() {
  return getFda483Letters();
}
