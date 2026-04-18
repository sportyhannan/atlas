"use server";

import { getTests } from "@/lib/test";

export async function fetchTests() {
  return getTests();
}
