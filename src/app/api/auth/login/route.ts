import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { getAppSettings } from "@/lib/app-settings";
import {
  confirmUserEmail,
  findAuthUserByEmail,
  isEmailNotConfirmedError,
} from "@/lib/auth-server";
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
    };

    if (!body.email || !body.password) {
      return jsonError("Email and password are required", 400);
    }

    const supabase = await createRouteClient();
    if (!supabase) {
      return jsonError("Authentication is not configured.", 503);
    }

    const attemptSignIn = () =>
      supabase.auth.signInWithPassword({
        email: body.email!,
        password: body.password!,
      });

    let { data, error } = await attemptSignIn();

    if (error && isEmailNotConfirmedError(error.message)) {
      const adminClient = createAdminClient();
      if (adminClient) {
        const settings = await getAppSettings(adminClient);

        if (!settings.requireEmailConfirmation) {
          const authUser = await findAuthUserByEmail(adminClient, body.email);
          if (authUser) {
            await confirmUserEmail(adminClient, authUser.id);
            ({ data, error } = await attemptSignIn());
          }
        }
      }
    }

    if (error) {
      return jsonError(error.message, 401);
    }

    return jsonSuccess({ userId: data.user?.id ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to sign in";
    return jsonError(message, 500);
  }
}
