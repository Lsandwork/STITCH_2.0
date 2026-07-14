import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

import type { Database } from "@/types/database";

export async function updateSession(
  request: NextRequest,
  response: NextResponse,
) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return response;
  }

  const setAll: SetAllCookies = (cookiesToSet) => {
    cookiesToSet.forEach(({ name, value }) => {
      request.cookies.set(name, value);
    });

    cookiesToSet.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
  };

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll,
    },
  });

  await supabase.auth.getUser();
  return response;
}
