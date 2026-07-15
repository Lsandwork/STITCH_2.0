import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

import {
  ADMIN_BOOTSTRAP_DISPLAY_NAME,
  ADMIN_BOOTSTRAP_EMAIL,
  ADMIN_BOOTSTRAP_PASSWORD,
} from "@/lib/admin-config";

const ADMIN_EMAIL = ADMIN_BOOTSTRAP_EMAIL;
const ADMIN_PASSWORD = ADMIN_BOOTSTRAP_PASSWORD;
const ADMIN_DISPLAY_NAME = ADMIN_BOOTSTRAP_DISPLAY_NAME;

function loadEnvFile(filename: string) {
  const filePath = path.join(ROOT, filename);
  if (!existsSync(filePath)) return;

  const content = readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
    );
    process.exit(1);
  }

  const admin = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: listed, error: listError } = await admin.auth.admin.listUsers();
  if (listError) {
    console.error("Failed to list users:", listError.message);
    process.exit(1);
  }

  const existing = listed.users.find(
    (user) => user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase(),
  );

  let userId = existing?.id;

  if (!userId) {
    const { data, error } = await admin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { display_name: ADMIN_DISPLAY_NAME },
      app_metadata: { role: "admin" },
    });

    if (error || !data.user) {
      console.error("Failed to create admin user:", error?.message ?? "Unknown error");
      process.exit(1);
    }

    userId = data.user.id;
    console.log("Created admin auth user:", ADMIN_EMAIL);
  } else {
    const { error } = await admin.auth.admin.updateUserById(userId, {
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { display_name: ADMIN_DISPLAY_NAME },
      app_metadata: { role: "admin" },
    });

    if (error) {
      console.error("Failed to update admin user:", error.message);
      process.exit(1);
    }

    console.log("Updated existing admin auth user:", ADMIN_EMAIL);
  }

  await admin.from("profiles").upsert({
    id: userId,
    email: ADMIN_EMAIL,
    display_name: ADMIN_DISPLAY_NAME,
    admin_role: "admin",
    skill_level: "advanced",
  } as never);

  await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      tier: "stitch_vision",
      status: "active",
      lifetime_access: true,
      access_notes: "Bootstrap admin account",
      access_granted_at: new Date().toISOString(),
    } as never,
    { onConflict: "user_id" },
  );

  await admin.from("user_activity").insert({
    user_id: userId,
    activity_type: "admin_access_changed",
    payload: { adminRole: "admin", source: "create-admin-script" },
  } as never);

  console.log("Admin profile and subscription configured.");
  console.log(`Email: ${ADMIN_EMAIL}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
