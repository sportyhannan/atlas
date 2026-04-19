import type { identity_resolution_matches } from "@/types/identity_resolution_matches";
import { createClient } from "../../supabase";

export async function getIdentityResolutionMatches(): Promise<
  identity_resolution_matches[]
> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("identity_resolution_matches")
      .select("*")
      .order("resolved_at", { ascending: false });

    if (error) {
      return [];
    }

    return data ?? [];
  } catch {
    return [];
  }
}

export async function getIdentityResolutionMatchById(
  id: string,
): Promise<identity_resolution_matches | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("identity_resolution_matches")
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
