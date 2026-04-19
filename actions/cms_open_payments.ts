"use server";

import { getCmsOpenPayments } from "@/lib/data/cms_open_payments";

export async function fetchCmsOpenPayments() {
  return getCmsOpenPayments();
}
