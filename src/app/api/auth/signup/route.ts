import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { getAppSettings } from "@/lib/app-settings";
import { jsonError, jsonSuccess, parseJsonBody } from "@/lib/api-utils";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

async function createRouteClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  const cookieStore = await cookies();

  const setAll: SetAllCookies = (cookiesToSet) => {
    cookiesToSet.forEach(({ name, value, options }) => {
      cookieStore.set(name, value, options);
    });
  };

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await parseJsonBody(request)) as {
      email?: string;
      password?: string;
      displayName?: string;
    };

    if (!body.email || !body.password || !body.displayName) {
      return jsonError("Email, password, and display name are required", 400);
    }

    const adminClient = createAdminClient();
    const supabase = await createRouteClient();

    if (!adminClient || !supabase) {
      return jsonError("Authentication is not configured.", 503);
    }

    const settings = await getAppSettings(adminClient);

    if (!settings.allowPublicSignup) {
      return jsonError("New signups are currently disabled.", 403);
    }

    const email = body.email.trim();
    const password = body.password;
    const displayName = body.displayName.trim();

    if (settings.requireEmailConfirmation) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });

      if (error) {
        return jsonError(error.message, 400);
      }

      const userId = data.user?.id;
      if (userId) {
        await adminClient.from("profiles").upsert({
          id: userId,
          email,
          display_name: displayName,
          skill_level: "beginner",
        } as never);
      }

      return jsonSuccess({
        userId: userId ?? null,
        requiresEmailConfirmation: true,
      });
    }

    const { data: created, error: createError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { display_name: displayName },
      });

    if (createError) {
      return jsonError(createError.message, 400);
    }

    const userId = created.user.id;

    await adminClient.from("profiles").upsert({
      id: userId,
      email,
      display_name: displayName,
      skill_level: "beginner",
    } as never);

    const { data: sessionData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      return jsonError(signInError.message, 400);
    }

    return jsonSuccess({
      userId: sessionData.user?.id ?? userId,
      requiresEmailConfirmation: false,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create account";
    return jsonError(message, 500);
  }
}
