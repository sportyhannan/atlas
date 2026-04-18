import type { Test } from "@/types/test";
import { createClient } from "../supabase/server";

export async function getTests(): Promise<Test[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("test").select("*");

    if (error) {
      return [];
    }

    return data ?? [];
  } catch {
    return [];
  }
}

export async function getTestById(id: string): Promise<Test | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("test")
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
