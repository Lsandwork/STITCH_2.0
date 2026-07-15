import { NextRequest } from "next/server";
import { jsonError, jsonSuccess, parseJsonBody } from "@/lib/api-utils";
import { requireSessionUser } from "@/lib/admin-auth";
import { logUserActivity, type ActivityType } from "@/lib/user-activity";

const ALLOWED_TYPES = new Set<ActivityType>(["login", "signup", "profile_updated"]);

export async function POST(request: NextRequest) {
  try {
    const user = await requireSessionUser();
    const body = (await parseJsonBody(request)) as {
      activityType?: ActivityType;
      payload?: Record<string, unknown>;
    };

    if (!body.activityType || !ALLOWED_TYPES.has(body.activityType)) {
      return jsonError("Invalid activity type", 400);
    }

    await logUserActivity({
      userId: user.id,
      activityType: body.activityType,
      payload: body.payload,
    });

    return jsonSuccess({ logged: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to log activity";
    const status = message.includes("required") ? 401 : 500;
    return jsonError(message, status);
  }
}
