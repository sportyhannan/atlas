import type { npi_providers } from "@/types/npi_providers";
import { createClient } from "../../supabase";

export async function getNpiProviders(): Promise<npi_providers[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("npi_providers")
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

export async function getNpiProviderById(
  id: string,
): Promise<npi_providers | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("npi_providers")
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
