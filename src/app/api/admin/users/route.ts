import { NextRequest } from "next/server";
import { jsonError, jsonSuccess, parseJsonBody } from "@/lib/api-utils";
import { resolveAdminRole } from "@/lib/admin-config";
import { requireSessionUser } from "@/lib/admin-auth";
import { isDemoModeEnabled } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SubscriptionTier } from "@/types/database";

type AdminUserRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  admin_role?: "user" | "admin";
  created_at: string;
  subscriptions:
    | {
        tier: SubscriptionTier;
        status: string;
        lifetime_access?: boolean;
      }
    | {
        tier: SubscriptionTier;
        status: string;
        lifetime_access?: boolean;
      }[]
    | null;
};

type SubscriptionInfo = {
  tier: SubscriptionTier;
  status: string;
  lifetime_access?: boolean;
};

function normalizeSubscription(
  subscriptions: AdminUserRow["subscriptions"],
): SubscriptionInfo | null {
  if (!subscriptions) return null;
  if (Array.isArray(subscriptions)) return subscriptions[0] ?? null;
  return subscriptions;
}

const PROFILE_SUBSCRIPTION_SELECT =
  "subscriptions!subscriptions_user_id_fkey(tier, status, lifetime_access)";

async function loadUsers(
  adminClient: NonNullable<ReturnType<typeof createAdminClient>>,
) {
  const full = await adminClient
    .from("profiles")
    .select(
      `id, email, display_name, avatar_url, admin_role, created_at, ${PROFILE_SUBSCRIPTION_SELECT}`,
    )
    .order("created_at", { ascending: false });

  if (!full.error && full.data) {
    return full.data as unknown as AdminUserRow[];
  }

  const basic = await adminClient
    .from("profiles")
    .select(
      `id, email, display_name, avatar_url, created_at, subscriptions!subscriptions_user_id_fkey(tier, status)`,
    )
    .order("created_at", { ascending: false });

  if (basic.error || !basic.data) {
    throw basic.error ?? new Error("Failed to load users");
  }

  const { data: authListed, error: authError } = await adminClient.auth.admin.listUsers({
    perPage: 1000,
  });
  if (authError) throw authError;

  const authById = Object.fromEntries(
    authListed.users.map((user) => [
      user.id,
      {
        role: (user.app_metadata as { role?: string } | undefined)?.role,
        email: user.email,
      },
    ]),
  );

  return (basic.data as unknown as AdminUserRow[]).map((row) => ({
    ...row,
    admin_role: resolveAdminRole({
      authRole: authById[row.id]?.role,
      email: row.email ?? authById[row.id]?.email,
    }),
  }));
}

function demoUsersFallback(adminUser: Awaited<ReturnType<typeof requireSessionUser>>) {
  return [
    {
      id: adminUser.id,
      email: adminUser.email,
      displayName: adminUser.displayName,
      avatarUrl: adminUser.avatarUrl,
      accountType: "admin" as const,
      tier: adminUser.subscriptionTier,
      status: "active",
      lifetimeAccess: adminUser.lifetimeAccess,
      createdAt: new Date().toISOString(),
    },
  ];
}

export async function GET() {
  try {
    const adminUser = await requireSessionUser();
    if (adminUser.adminRole !== "admin") {
      return jsonError("Admin access required", 403);
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      if (isDemoModeEnabled()) {
        return jsonSuccess({ users: demoUsersFallback(adminUser), demoFallback: true });
      }
      return jsonError(
        "Admin backend is not configured. Add SUPABASE_SERVICE_ROLE_KEY to Vercel.",
        503,
      );
    }

    const rows = await loadUsers(adminClient);
    const users = rows.map((row) => {
      const subscription = normalizeSubscription(row.subscriptions);
      return {
        id: row.id,
        email: row.email ?? "",
        displayName: row.display_name ?? "Maker",
        avatarUrl: row.avatar_url,
        accountType: row.admin_role ?? "user",
        tier: subscription?.tier ?? "free",
        status: subscription?.status ?? "active",
        lifetimeAccess: subscription?.lifetime_access ?? false,
        createdAt: row.created_at,
      };
    });

    return jsonSuccess({ users });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load users";
    const status = message.includes("Admin") ? 403 : message.includes("Authentication") ? 401 : 500;
    return jsonError(message, status);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminUser = await requireSessionUser();
    if (adminUser.adminRole !== "admin") {
      return jsonError("Admin access required", 403);
    }

    const body = (await parseJsonBody(request)) as {
      userId?: string;
      tier?: SubscriptionTier;
      lifetimeAccess?: boolean;
      adminRole?: "user" | "admin";
    };

    if (!body.userId) {
      return jsonError("userId is required", 400);
    }

    if (body.adminRole && body.userId === adminUser.id && body.adminRole !== "admin") {
      return jsonError("You cannot remove your own admin access", 400);
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      if (isDemoModeEnabled()) {
        return jsonSuccess({
          message: "Demo mode: user access changes are simulated locally.",
          demoFallback: true,
        });
      }
      return jsonError(
        "Admin backend is not configured. Add SUPABASE_SERVICE_ROLE_KEY to Vercel.",
        503,
      );
    }

    if (body.adminRole) {
      const { error: roleError } = await adminClient
        .from("profiles")
        .update({ admin_role: body.adminRole } as never)
        .eq("id", body.userId);

      if (roleError) {
        /* column may not exist yet */
      }

      await adminClient.auth.admin.updateUserById(body.userId, {
        app_metadata: { role: body.adminRole },
      });
    }

    const subscriptionUpdate: Record<string, unknown> = {};
    if (body.tier) subscriptionUpdate.tier = body.tier;

    const { data: existingSubscription } = await adminClient
      .from("subscriptions")
      .select("tier")
      .eq("user_id", body.userId)
      .maybeSingle();

    if (typeof body.lifetimeAccess === "boolean") {
      subscriptionUpdate.lifetime_access = body.lifetimeAccess;
      subscriptionUpdate.access_granted_by = body.lifetimeAccess ? adminUser.id : null;
      subscriptionUpdate.access_granted_at = body.lifetimeAccess
        ? new Date().toISOString()
        : null;
      subscriptionUpdate.access_notes = body.lifetimeAccess
        ? "Granted by admin"
        : null;

      if (body.lifetimeAccess && !body.tier) {
        const currentTier = (existingSubscription as { tier?: SubscriptionTier } | null)?.tier;
        if (!currentTier || currentTier === "free") {
          subscriptionUpdate.tier = "stitch_vision";
        }
      }
    }

    if (Object.keys(subscriptionUpdate).length > 0) {
      if (existingSubscription) {
        const { error: subError } = await adminClient
          .from("subscriptions")
          .update(subscriptionUpdate as never)
          .eq("user_id", body.userId);

        if (subError) {
          return jsonError(subError.message, 400);
        }
      } else {
        const { error: insertError } = await adminClient.from("subscriptions").insert({
          user_id: body.userId,
          tier: (subscriptionUpdate.tier as SubscriptionTier) ?? "free",
          status: "active",
          lifetime_access: subscriptionUpdate.lifetime_access === true,
          access_granted_by:
            subscriptionUpdate.lifetime_access === true ? adminUser.id : null,
          access_granted_at:
            subscriptionUpdate.lifetime_access === true
              ? new Date().toISOString()
              : null,
          access_notes:
            subscriptionUpdate.lifetime_access === true ? "Granted by admin" : null,
        } as never);

        if (insertError) {
          return jsonError(insertError.message, 400);
        }
      }
    }

    const { logUserActivity } = await import("@/lib/user-activity");

    if (body.tier) {
      await logUserActivity({
        userId: body.userId,
        activityType: "tier_changed",
        payload: {
          tier: (subscriptionUpdate.tier as SubscriptionTier) ?? body.tier,
          changedBy: adminUser.id,
        },
      });
    } else if (subscriptionUpdate.tier) {
      await logUserActivity({
        userId: body.userId,
        activityType: "tier_changed",
        payload: {
          tier: subscriptionUpdate.tier,
          changedBy: adminUser.id,
          reason: "lifetime_access_default",
        },
      });
    }

    if (typeof body.lifetimeAccess === "boolean") {
      await logUserActivity({
        userId: body.userId,
        activityType: body.lifetimeAccess
          ? "lifetime_access_granted"
          : "lifetime_access_revoked",
        payload: { changedBy: adminUser.id },
      });
    }

    if (body.adminRole) {
      await logUserActivity({
        userId: body.userId,
        activityType: "admin_access_changed",
        payload: { adminRole: body.adminRole, changedBy: adminUser.id },
      });
    }

    return jsonSuccess({ message: "User access updated." });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update user access";
    const status = message.includes("Admin") ? 403 : message.includes("Authentication") ? 401 : 500;
    return jsonError(message, status);
  }
}
