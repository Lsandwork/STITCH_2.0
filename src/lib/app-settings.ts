import type { createAdminClient } from "@/lib/supabase/admin";

export type AppSettingKey =
  | "require_email_confirmation"
  | "allow_public_signup";

export type AppSettings = {
  requireEmailConfirmation: boolean;
  allowPublicSignup: boolean;
};

const DEFAULTS: AppSettings = {
  requireEmailConfirmation: false,
  allowPublicSignup: true,
};

const KEY_MAP: Record<keyof AppSettings, AppSettingKey> = {
  requireEmailConfirmation: "require_email_confirmation",
  allowPublicSignup: "allow_public_signup",
};

type AdminClient = NonNullable<ReturnType<typeof createAdminClient>>;

function parseBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

export async function getAppSettings(
  adminClient: AdminClient,
): Promise<AppSettings> {
  const { data, error } = await adminClient.from("app_settings").select("key, value");

  if (error || !data) {
    return DEFAULTS;
  }

  const rows = data as { key: string; value: unknown }[];
  const byKey = Object.fromEntries(rows.map((row) => [row.key, row.value]));

  return {
    requireEmailConfirmation: parseBoolean(
      byKey.require_email_confirmation,
      DEFAULTS.requireEmailConfirmation,
    ),
    allowPublicSignup: parseBoolean(
      byKey.allow_public_signup,
      DEFAULTS.allowPublicSignup,
    ),
  };
}

export async function updateAppSettings(
  adminClient: AdminClient,
  patch: Partial<AppSettings>,
  updatedBy: string,
): Promise<AppSettings> {
  const entries = Object.entries(patch) as [keyof AppSettings, boolean][];

  for (const [settingKey, value] of entries) {
    const dbKey = KEY_MAP[settingKey];
    await adminClient.from("app_settings").upsert(
      {
        key: dbKey,
        value,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy,
      } as never,
      { onConflict: "key" },
    );
  }

  return getAppSettings(adminClient);
}
