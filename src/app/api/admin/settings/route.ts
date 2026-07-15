import { NextRequest } from "next/server";
import { getAppSettings, updateAppSettings, type AppSettings } from "@/lib/app-settings";
import { jsonError, jsonSuccess, parseJsonBody } from "@/lib/api-utils";
import { requireSessionUser } from "@/lib/admin-auth";
import { isDemoModeEnabled } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import { logUserActivity } from "@/lib/user-activity";

const DEMO_DEFAULTS: AppSettings = {
  requireEmailConfirmation: false,
  allowPublicSignup: true,
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
        return jsonSuccess({ settings: DEMO_DEFAULTS, demoFallback: true });
      }
      return jsonError(
        "Admin backend is not configured. Add SUPABASE_SERVICE_ROLE_KEY to Vercel.",
        503,
      );
    }

    const settings = await getAppSettings(adminClient);

    return jsonSuccess({ settings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load settings";
    const status = message.includes("Admin")
      ? 403
      : message.includes("Authentication")
        ? 401
        : message.includes("not configured")
          ? 503
          : 500;
    return jsonError(message, status);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminUser = await requireSessionUser();
    if (adminUser.adminRole !== "admin") {
      return jsonError("Admin access required", 403);
    }

    const body = (await parseJsonBody(request)) as Partial<AppSettings>;
    const adminClient = createAdminClient();

    if (!adminClient) {
      if (isDemoModeEnabled()) {
        return jsonSuccess({
          settings: { ...DEMO_DEFAULTS, ...body },
          demoFallback: true,
          message: "Demo mode: settings changes are simulated locally.",
        });
      }
      return jsonError(
        "Admin backend is not configured. Add SUPABASE_SERVICE_ROLE_KEY to Vercel.",
        503,
      );
    }

    const patch: Partial<AppSettings> = {};
    if (typeof body.requireEmailConfirmation === "boolean") {
      patch.requireEmailConfirmation = body.requireEmailConfirmation;
    }
    if (typeof body.allowPublicSignup === "boolean") {
      patch.allowPublicSignup = body.allowPublicSignup;
    }

    if (Object.keys(patch).length === 0) {
      return jsonError("No valid settings provided", 400);
    }

    const settings = await updateAppSettings(adminClient, patch, adminUser.id);

    await logUserActivity({
      userId: adminUser.id,
      activityType: "admin_settings_changed",
      payload: patch,
    });

    return jsonSuccess({
      settings,
      message: "Settings updated.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update settings";
    const status = message.includes("Admin")
      ? 403
      : message.includes("Authentication")
        ? 401
        : 500;
    return jsonError(message, status);
  }
}
