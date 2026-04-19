"use server";

import { getRisingStars } from "@/lib/rising-stars";

export async function fetchRisingStars() {
  return getRisingStars();
}
