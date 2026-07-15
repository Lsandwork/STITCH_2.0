import { createClient } from "@/lib/supabase/server";
import { requireAdminClient } from "@/lib/supabase/admin";
import type { AppUser } from "@/lib/app-user";

export async function getSessionUser(): Promise<AppUser | null> {
  const { getServerAppUser } = await import("@/lib/app-user");
  return getServerAppUser();
}

export async function requireSessionUser(): Promise<AppUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

export async function requireSessionAdmin(): Promise<{
  user: AppUser;
  adminClient: ReturnType<typeof requireAdminClient>;
}> {
  const user = await requireSessionUser();
  if (user.adminRole !== "admin") {
    throw new Error("Admin access required");
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const adminClient = createAdminClient();
  if (!adminClient) {
    throw new Error(
      "Admin backend is not configured. Add SUPABASE_SERVICE_ROLE_KEY to Vercel environment variables.",
    );
  }

  return { user, adminClient };
}

export async function getAuthUserId(): Promise<string | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}
