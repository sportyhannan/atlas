import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
  if (!key) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required");
  if (!secretKey) throw new Error("SUPABASE_SECRET_KEY is required");

  return { url, key, secretKey };
}

/**
 * The type of access to the Supabase client.
 */
export type AccessType = "user" | "admin";

export const createServerSupabaseClient = (access?: AccessType) =>
  access === "admin" ? getAdminClient() : getUserClient();

/**
 *
 * @returns A Supabase client for the user authenticated with Clerk. Enforces RLS policies.
 */
export function getUserClient() {
  const { url, key } = getSupabaseConfig();
  return createClient(url, key, {
    async accessToken() {
      return (await auth()).getToken();
    },
  });
}

/**
 *
 * @returns A Supabase client for the admin user. Bypasses RLS policies.
 */
export function getAdminClient() {
  const { url, secretKey } = getSupabaseConfig();

  return createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}