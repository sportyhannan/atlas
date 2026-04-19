"use server";

import { getOpenalexAuthors } from "@/lib/data/openalex_authors";

export async function fetchOpenalexAuthors() {
  return getOpenalexAuthors();
}
