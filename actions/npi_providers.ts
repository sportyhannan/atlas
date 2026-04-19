"use server";

import { getNpiProviders } from "@/lib/data/npi_providers";

export async function fetchNpiProviders() {
  return getNpiProviders();
}
