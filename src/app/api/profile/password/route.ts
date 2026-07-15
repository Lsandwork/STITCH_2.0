import { NextRequest } from "next/server";
import { jsonError, jsonSuccess, parseJsonBody } from "@/lib/api-utils";
import { requireSessionUser } from "@/lib/admin-auth";
import { logUserActivity } from "@/lib/user-activity";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const user = await requireSessionUser();
    const body = (await parseJsonBody(request)) as {
      password?: string;
      confirmPassword?: string;
    };

    if (!body.password || body.password.length < 6) {
      return jsonError("Password must be at least 6 characters", 400);
    }

    if (body.password !== body.confirmPassword) {
      return jsonError("Passwords do not match", 400);
    }

    const supabase = await createClient();
    if (!supabase) {
      return jsonError("Supabase not configured", 503);
    }

    const { error } = await supabase.auth.updateUser({
      password: body.password,
    });

    if (error) {
      return jsonError(error.message, 400);
    }

    await logUserActivity({
      userId: user.id,
      activityType: "password_changed",
    });

    return jsonSuccess({ message: "Password updated successfully." });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update password";
    const status = message.includes("required") ? 401 : 500;
    return jsonError(message, status);
  }
}
