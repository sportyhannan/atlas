import type { pubmed_articles } from "@/types/pubmed_articles";
import { createClient } from "../../supabase";

export async function getPubmedArticles(): Promise<pubmed_articles[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("pubmed_articles")
      .select("*")
      .order("ingested_at", { ascending: false });

    if (error) {
      return [];
    }

    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPubmedArticleById(
  id: string,
): Promise<pubmed_articles | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("pubmed_articles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}
