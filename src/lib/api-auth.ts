import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function getAuthenticatedUserId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}
