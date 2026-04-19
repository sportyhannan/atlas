import type { fda_inspection_observations } from "@/types/fda_inspection_observations";
import { createClient } from "../../supabase";

export async function getFdaInspectionObservations(): Promise<
  fda_inspection_observations[]
> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("fda_inspection_observations")
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

export async function getFdaInspectionObservationById(
  id: string,
): Promise<fda_inspection_observations | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("fda_inspection_observations")
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
