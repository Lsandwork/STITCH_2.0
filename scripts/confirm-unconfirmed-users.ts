import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  let page = 1;
  let confirmed = 0;

  while (page <= 20) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;

    for (const user of data.users) {
      if (!user.email_confirmed_at) {
        const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
          email_confirm: true,
        });
        if (updateError) {
          console.error(`Failed to confirm ${user.email}:`, updateError.message);
        } else {
          console.log(`Confirmed: ${user.email}`);
          confirmed += 1;
        }
      }
    }

    if (data.users.length < 200) break;
    page += 1;
  }

  console.log(`Done. Confirmed ${confirmed} user(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
