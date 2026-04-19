import type { ictrp_trials } from "@/types/ictrp_trials";
import { createClient } from "../../supabase";

export async function getIctrpTrials(): Promise<ictrp_trials[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("ictrp_trials")
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

export async function getIctrpTrialById(
  id: string,
): Promise<ictrp_trials | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("ictrp_trials")
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
