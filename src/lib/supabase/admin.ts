import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type StitchAdminClient = ReturnType<typeof createClient<Database>>;

let adminClient: StitchAdminClient | null | undefined;

function getAdminEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url, serviceRoleKey };
}

export function isSupabaseAdminConfigured(): boolean {
  return getAdminEnv() !== null;
}

/**
 * Service-role Supabase client for trusted server-side operations only.
 */
export function createAdminClient() {
  if (adminClient !== undefined) {
    return adminClient;
  }

  const env = getAdminEnv();
  if (!env) {
    adminClient = null;
    return adminClient;
  }

  adminClient = createClient<Database>(env.url, env.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}

export function requireAdminClient() {
  const client = createAdminClient();
  if (!client) {
    throw new Error(
      "Supabase admin client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return client;
}
