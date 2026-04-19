import type { agent_scoring_runs } from "@/types/agent_scoring_runs";
import { createClient } from "../../supabase";

export async function getAgentScoringRuns(): Promise<agent_scoring_runs[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("agent_scoring_runs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return [];
    }

    return data ?? [];
  } catch {
    return [];
  }
}

export async function getAgentScoringRunById(
  id: string,
): Promise<agent_scoring_runs | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("agent_scoring_runs")
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
