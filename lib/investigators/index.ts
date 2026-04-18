import type { Investigator } from "@/types/investigator";
import { createClient } from "../supabase";

export async function getInvestigators(): Promise<Investigator[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("investigators")
      .select("*")
      .order("fit_score", { ascending: false });

    if (error) {
      return [];
    }

    return data ?? [];
  } catch {
    return [];
  }
}

export async function getInvestigatorById(
  id: string,
): Promise<Investigator | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("investigators")
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
