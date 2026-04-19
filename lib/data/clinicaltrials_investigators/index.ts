import type { clinicaltrials_investigators } from "@/types/clinicaltrials_investigators";
import { createClient } from "../../supabase";

export async function getClinicaltrialsInvestigators(): Promise<
  clinicaltrials_investigators[]
> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("clinicaltrials_investigators")
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

export async function getClinicaltrialsInvestigatorById(
  id: string,
): Promise<clinicaltrials_investigators | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("clinicaltrials_investigators")
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
