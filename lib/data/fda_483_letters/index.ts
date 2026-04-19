import type { fda_483_letters } from "@/types/fda_483_letters";
import { createClient } from "../../supabase";

export async function getFda483Letters(): Promise<fda_483_letters[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("fda_483_letters")
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

export async function getFda483LetterById(
  id: string,
): Promise<fda_483_letters | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("fda_483_letters")
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
