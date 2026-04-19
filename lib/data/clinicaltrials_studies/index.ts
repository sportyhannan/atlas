import type { clinicaltrials_studies } from "@/types/clinicaltrials_studies";
import { createClient } from "../../supabase";

export async function getClinicaltrialsStudies(): Promise<
  clinicaltrials_studies[]
> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("clinicaltrials_studies")
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

export async function getClinicaltrialsStudyById(
  id: string,
): Promise<clinicaltrials_studies | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("clinicaltrials_studies")
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
