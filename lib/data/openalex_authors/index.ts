import type { openalex_authors } from "@/types/openalex_authors";
import { createClient } from "../../supabase";

export async function getOpenalexAuthors(): Promise<openalex_authors[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("openalex_authors")
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

export async function getOpenalexAuthorById(
  id: string,
): Promise<openalex_authors | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("openalex_authors")
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
