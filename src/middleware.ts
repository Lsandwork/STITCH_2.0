import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { AUTH_ROUTES, isDemoModeEnabled } from "@/lib/constants";
import type { Database } from "@/types/database";

const STATIC_FILE_PATTERN =
  /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|map)$/i;

function isPublicPath(pathname: string): boolean {
  if (pathname.startsWith("/assets")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/favicon.ico") return true;
  if (pathname === "/manifest.webmanifest") return true;
  if (pathname === "/offline") return true;
  if (pathname === "/onboarding") return true;
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (STATIC_FILE_PATTERN.test(pathname) || isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (isDemoModeEnabled()) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  let response = NextResponse.next({ request });

  const setAll: SetAllCookies = (cookiesToSet) => {
    cookiesToSet.forEach(({ name, value }) => {
      request.cookies.set(name, value);
    });
    response = NextResponse.next({ request });
    cookiesToSet.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
  };

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll,
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
