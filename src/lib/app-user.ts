import type { SubscriptionTier } from "@/types/database";
import {
  isBootstrapAdminEmail,
  resolveAdminRole,
} from "@/lib/admin-config";

export type AdminRole = "user" | "admin";

export type AppUser = {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  adminRole: AdminRole;
  subscriptionTier: SubscriptionTier;
  lifetimeAccess: boolean;
};

const DEFAULT_AVATAR = "/assets/stitch/avatars/svg/avatar-1.svg";

type ProfileRow = {
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  skill_level: "beginner" | "intermediate" | "advanced" | null;
  admin_role?: AdminRole | null;
};

type SubscriptionRow = {
  tier: SubscriptionTier | null;
  lifetime_access?: boolean | null;
};

async function loadProfile(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>,
  userId: string,
): Promise<ProfileRow | null> {
  if (!supabase) return null;

  const withRole = await supabase
    .from("profiles")
    .select("display_name, email, avatar_url, skill_level, admin_role")
    .eq("id", userId)
    .maybeSingle();

  if (!withRole.error && withRole.data) {
    return withRole.data as ProfileRow;
  }

  const basic = await supabase
    .from("profiles")
    .select("display_name, email, avatar_url, skill_level")
    .eq("id", userId)
    .maybeSingle();

  if (basic.error || !basic.data) return null;
  return basic.data as ProfileRow;
}

async function loadSubscription(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>,
  userId: string,
): Promise<SubscriptionRow | null> {
  if (!supabase) return null;

  const withLifetime = await supabase
    .from("subscriptions")
    .select("tier, lifetime_access")
    .eq("user_id", userId)
    .maybeSingle();

  if (!withLifetime.error && withLifetime.data) {
    return withLifetime.data as SubscriptionRow;
  }

  const basic = await supabase
    .from("subscriptions")
    .select("tier")
    .eq("user_id", userId)
    .maybeSingle();

  if (basic.error || !basic.data) return null;
  return basic.data as SubscriptionRow;
}

export async function getServerAppUser(): Promise<AppUser | null> {
  const { createClient } = await import("@/lib/supabase/server");
  const { cookies } = await import("next/headers");
  const { isDemoModeEnabled } = await import("@/lib/constants");
  const supabase = await createClient();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const profileRow = await loadProfile(supabase, user.id);
      const subscriptionRow = await loadSubscription(supabase, user.id);

      const metadata = user.user_metadata as { display_name?: string } | undefined;
      const appMetadata = user.app_metadata as { role?: string } | undefined;
      const email = profileRow?.email ?? user.email ?? "";

      const adminRole = resolveAdminRole({
        profileRole: profileRow?.admin_role,
        authRole: appMetadata?.role,
        email,
      });

      const lifetimeAccess =
        subscriptionRow?.lifetime_access === true || isBootstrapAdminEmail(email);

      return {
        id: user.id,
        displayName:
          profileRow?.display_name ??
          metadata?.display_name ??
          user.email?.split("@")[0] ??
          "Maker",
        email,
        avatarUrl: profileRow?.avatar_url ?? DEFAULT_AVATAR,
        skillLevel: profileRow?.skill_level ?? "beginner",
        adminRole,
        subscriptionTier:
          subscriptionRow?.tier ??
          (isBootstrapAdminEmail(email) ? "stitch_vision" : "free"),
        lifetimeAccess,
      };
    }
  }

  if (isDemoModeEnabled()) {
    const cookieStore = await cookies();
    const demoEmail = cookieStore.get("stitch-demo-email")?.value;
    if (demoEmail && cookieStore.get("stitch-demo-auth")?.value === "1") {
      const email = decodeURIComponent(demoEmail);
      const adminRole = resolveAdminRole({ email });
      return {
        id: "demo-admin-user",
        displayName: "Stitch Admin",
        email,
        avatarUrl: DEFAULT_AVATAR,
        skillLevel: "advanced",
        adminRole,
        subscriptionTier: isBootstrapAdminEmail(email) ? "stitch_vision" : "free",
        lifetimeAccess: isBootstrapAdminEmail(email),
      };
    }
  }

  return null;
}

export async function requireAdminUser(): Promise<AppUser> {
  const user = await getServerAppUser();
  if (!user || user.adminRole !== "admin") {
    throw new Error("Admin access required");
  }
  return user;
}
