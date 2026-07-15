import { readFileSync } from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";
import { jsonError, jsonSuccess } from "@/lib/api-utils";
import {
  ADMIN_BOOTSTRAP_DISPLAY_NAME,
  ADMIN_BOOTSTRAP_EMAIL,
  ADMIN_BOOTSTRAP_PASSWORD,
} from "@/lib/admin-config";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

async function applyMigrationIfPossible(): Promise<{ applied: boolean; message: string }> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return {
      applied: false,
      message: "DATABASE_URL not set — run SQL migration manually in Supabase.",
    };
  }

  try {
    const { Client } = await import("pg");
    const migrationPath = path.join(
      process.cwd(),
      "supabase/migrations/20260714000012_admin_users_activity.sql",
    );
    const sql = readFileSync(migrationPath, "utf8");
    const client = new Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();
    await client.query(sql);
    await client.end();
    return { applied: true, message: "Admin migration applied." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Migration failed";
    return { applied: false, message };
  }
}

async function bootstrapAdminUser() {
  const admin = createAdminClient();
  if (!admin) {
    throw new Error("Supabase service role is not configured.");
  }

  const { data: listed, error: listError } = await admin.auth.admin.listUsers({
    perPage: 1000,
  });
  if (listError) throw listError;

  const existing = listed.users.find(
    (user) => user.email?.toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase(),
  );

  let userId = existing?.id;

  if (!userId) {
    const { data, error } = await admin.auth.admin.createUser({
      email: ADMIN_BOOTSTRAP_EMAIL,
      password: ADMIN_BOOTSTRAP_PASSWORD,
      email_confirm: true,
      user_metadata: { display_name: ADMIN_BOOTSTRAP_DISPLAY_NAME },
      app_metadata: { role: "admin" },
    });
    if (error || !data.user) throw error ?? new Error("Failed to create admin user");
    userId = data.user.id;
  } else {
    const { error } = await admin.auth.admin.updateUserById(userId, {
      password: ADMIN_BOOTSTRAP_PASSWORD,
      email_confirm: true,
      user_metadata: { display_name: ADMIN_BOOTSTRAP_DISPLAY_NAME },
      app_metadata: { role: "admin" },
    });
    if (error) throw error;
  }

  const profilePayload = {
    id: userId,
    email: ADMIN_BOOTSTRAP_EMAIL,
    display_name: ADMIN_BOOTSTRAP_DISPLAY_NAME,
    admin_role: "admin",
    skill_level: "advanced",
  };

  const profileWithRole = await admin.from("profiles").upsert(profilePayload as never);
  if (profileWithRole.error) {
    await admin.from("profiles").upsert({
      id: userId,
      email: ADMIN_BOOTSTRAP_EMAIL,
      display_name: ADMIN_BOOTSTRAP_DISPLAY_NAME,
      skill_level: "advanced",
    } as never);
  }

  const subscriptionPayload = {
    user_id: userId,
    tier: "stitch_vision",
    status: "active",
    lifetime_access: true,
    access_notes: "Bootstrap admin account",
    access_granted_at: new Date().toISOString(),
  };

  const subWithLifetime = await admin
    .from("subscriptions")
    .upsert(subscriptionPayload as never, { onConflict: "user_id" });

  if (subWithLifetime.error) {
    await admin.from("subscriptions").upsert(
      {
        user_id: userId,
        tier: "stitch_vision",
        status: "active",
      } as never,
      { onConflict: "user_id" },
    );
  }

  try {
    await admin.from("user_activity").insert({
      user_id: userId,
      activity_type: "admin_access_changed",
      payload: { adminRole: "admin", source: "bootstrap-api" },
    } as never);
  } catch {
    /* activity table may not exist yet */
  }

  return userId;
}

export async function POST(request: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return jsonError(
      "Supabase service role is not configured on this deployment.",
      503,
    );
  }

  const setupSecret = process.env.SETUP_SECRET ?? process.env.CRON_SECRET;
  const providedSecret = request.headers.get("x-setup-secret");

  if (setupSecret) {
    if (providedSecret !== setupSecret) {
      return jsonError("Invalid setup secret", 401);
    }
  }

  try {
    const migration = await applyMigrationIfPossible();
    const userId = await bootstrapAdminUser();

    return jsonSuccess({
      ok: true,
      email: ADMIN_BOOTSTRAP_EMAIL,
      userId,
      migration,
      message:
        "Admin account configured. Sign out and sign back in to see the Users tab.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Bootstrap failed";
    return jsonError(message, 500);
  }
}
