import type { cms_open_payments } from "@/types/cms_open_payments";
import { createClient } from "../../supabase";

export async function getCmsOpenPayments(): Promise<cms_open_payments[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("cms_open_payments")
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

export async function getCmsOpenPaymentById(
  id: string,
): Promise<cms_open_payments | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("cms_open_payments")
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
