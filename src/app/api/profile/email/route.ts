import { NextRequest } from "next/server";
import { jsonError, jsonSuccess, parseJsonBody } from "@/lib/api-utils";
import { requireSessionUser } from "@/lib/admin-auth";
import { logUserActivity } from "@/lib/user-activity";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const user = await requireSessionUser();
    const body = (await parseJsonBody(request)) as {
      email?: string;
    };

    if (!body.email || !body.email.includes("@")) {
      return jsonError("A valid email is required", 400);
    }

    const supabase = await createClient();
    if (!supabase) {
      return jsonError("Supabase not configured", 503);
    }

    const { error: authError } = await supabase.auth.updateUser({
      email: body.email,
    });

    if (authError) {
      return jsonError(authError.message, 400);
    }

    await supabase
      .from("profiles")
      .update({ email: body.email } as never)
      .eq("id", user.id);

    await logUserActivity({
      userId: user.id,
      activityType: "email_changed",
      payload: { email: body.email },
    });

    return jsonSuccess({
      message:
        "Email update requested. Check your inbox to confirm the new address.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update email";
    const status = message.includes("required") ? 401 : 500;
    return jsonError(message, status);
  }
}
