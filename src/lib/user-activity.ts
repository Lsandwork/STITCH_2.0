export type ActivityType =
  | "signup"
  | "login"
  | "profile_updated"
  | "email_changed"
  | "password_changed"
  | "avatar_uploaded"
  | "tier_changed"
  | "lifetime_access_granted"
  | "lifetime_access_revoked"
  | "admin_access_changed"
  | "admin_settings_changed";

type LogActivityInput = {
  userId: string;
  activityType: ActivityType;
  entityType?: string;
  entityId?: string;
  payload?: Record<string, unknown>;
};

export async function logUserActivity(input: LogActivityInput): Promise<void> {
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const admin = createAdminClient();
    if (!admin) return;

    await admin.from("user_activity").insert({
      user_id: input.userId,
      activity_type: input.activityType,
      entity_type: input.entityType ?? null,
      entity_id: input.entityId ?? null,
      payload: input.payload ?? {},
    } as never);
  } catch (error) {
    console.error("[user-activity]", error);
  }
}

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  signup: "Signed up",
  login: "Signed in",
  profile_updated: "Updated profile",
  email_changed: "Changed email",
  password_changed: "Changed password",
  avatar_uploaded: "Uploaded profile photo",
  tier_changed: "Subscription tier changed",
  lifetime_access_granted: "Lifetime access granted",
  lifetime_access_revoked: "Lifetime access revoked",
  admin_access_changed: "Admin access changed",
  admin_settings_changed: "Admin settings changed",
};
