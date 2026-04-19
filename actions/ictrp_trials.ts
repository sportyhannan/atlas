"use server";

import { getIctrpTrials } from "@/lib/data/ictrp_trials";

export async function fetchIctrpTrials() {
  return getIctrpTrials();
}
