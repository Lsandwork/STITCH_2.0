import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";

type StitchBrowserClient = ReturnType<typeof createBrowserClient<Database>>;

let browserClient: StitchBrowserClient | null | undefined;

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}

/**
 * Returns a browser Supabase client, or null when env vars are missing.
 * Safe for demo mode and local UI development without credentials.
 */
export function createClient(): StitchBrowserClient | null {
  if (browserClient !== undefined) {
    return browserClient;
  }

  const env = getSupabaseEnv();
  if (!env) {
    browserClient = null;
    return browserClient;
  }

  browserClient = createBrowserClient<Database>(env.url, env.anonKey);
  return browserClient;
}

/**
 * Returns a client or throws when Supabase is required for the current action.
 */
export function requireClient(): StitchBrowserClient {
  const client = createClient();
  if (!client) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return client;
}
