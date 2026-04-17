import type { SignedInSessionResource } from "@clerk/types";
import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client with the Clerk session token.
 * @param session - The session object from Clerk.
 * @returns A Supabase client.
 */
export function createBrowserClient(session: SignedInSessionResource | null) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      async accessToken() {
        return session?.getToken() ?? null;
      },
    },
  );
}