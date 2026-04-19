"use server";

import { getPubmedArticles } from "@/lib/data/pubmed_articles";

export async function fetchPubmedArticles() {
  return getPubmedArticles();
}
