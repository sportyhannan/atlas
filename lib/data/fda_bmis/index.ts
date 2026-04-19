import type { fda_bmis } from "@/types/fda_bmis";
import { createClient } from "../../supabase";

export async function getFdaBmis(): Promise<fda_bmis[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("fda_bmis")
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

export async function getFdaBmisById(id: string): Promise<fda_bmis | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("fda_bmis")
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
