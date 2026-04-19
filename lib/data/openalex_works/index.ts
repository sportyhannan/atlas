import type { openalex_works } from "@/types/openalex_works";
import { createClient } from "../../supabase";

export async function getOpenalexWorks(): Promise<openalex_works[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("openalex_works")
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

export async function getOpenalexWorkById(
  id: string,
): Promise<openalex_works | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("openalex_works")
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
