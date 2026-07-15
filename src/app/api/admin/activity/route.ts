import { jsonError, jsonSuccess } from "@/lib/api-utils";
import { requireSessionUser } from "@/lib/admin-auth";
import { isDemoModeEnabled } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import { ACTIVITY_LABELS } from "@/lib/user-activity";

type ActivityRow = {
  id: string;
  user_id: string;
  activity_type: keyof typeof ACTIVITY_LABELS;
  payload: Record<string, unknown> | null;
  created_at: string;
  profiles: {
    display_name: string | null;
    email: string | null;
  } | null;
};

export async function GET() {
  try {
    const adminUser = await requireSessionUser();
    if (adminUser.adminRole !== "admin") {
      return jsonError("Admin access required", 403);
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      if (isDemoModeEnabled()) {
        return jsonSuccess({
          activity: [
            {
              id: "demo-login",
              userId: adminUser.id,
              displayName: adminUser.displayName,
              email: adminUser.email,
              activityType: "login",
              label: ACTIVITY_LABELS.login,
              payload: { demoMode: true },
              createdAt: new Date().toISOString(),
            },
          ],
          demoFallback: true,
        });
      }
      return jsonError(
        "Admin backend is not configured. Add SUPABASE_SERVICE_ROLE_KEY to Vercel.",
        503,
      );
    }

    const { data, error } = await adminClient
      .from("user_activity")
      .select("id, user_id, activity_type, payload, created_at, profiles(display_name, email)")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      return jsonSuccess({ activity: [], warning: error.message });
    }

    const activity = ((data ?? []) as unknown as ActivityRow[]).map((row) => ({
      id: row.id,
      userId: row.user_id,
      displayName: row.profiles?.display_name ?? "Maker",
      email: row.profiles?.email ?? "",
      activityType: row.activity_type,
      label: ACTIVITY_LABELS[row.activity_type] ?? row.activity_type,
      payload: row.payload ?? {},
      createdAt: row.created_at,
    }));

    return jsonSuccess({ activity });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load user activity";
    const status = message.includes("Admin") ? 403 : message.includes("Authentication") ? 401 : 500;
    return jsonError(message, status);
  }
}
