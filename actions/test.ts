"use server";

import { getTests } from "@/lib/data/test";

export async function fetchTests() {
  return getTests();
}
