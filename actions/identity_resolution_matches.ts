"use server";

import { getIdentityResolutionMatches } from "@/lib/data/identity_resolution_matches";

export async function fetchIdentityResolutionMatches() {
  return getIdentityResolutionMatches();
}
