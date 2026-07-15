import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export const AUTH_USER_ID_KEY = "stitch-auth-user-id";

export type AuthResult = {
  ok: boolean;
  error?: string;
  userId?: string;
};

export function persistAuthUserId(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_USER_ID_KEY, userId);
}

export function clearAuthUserId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_USER_ID_KEY);
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Authentication is not configured." };
  }

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = (await response.json()) as {
    error?: string;
    userId?: string;
  };

  if (!response.ok) {
    return { ok: false, error: data.error ?? "Could not sign in." };
  }

  if (data.userId) {
    persistAuthUserId(data.userId);

    const supabase = createClient();
    if (supabase) {
      await supabase.auth.getSession();
    }
  }

  return { ok: true, userId: data.userId };
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
): Promise<AuthResult & { requiresEmailConfirmation?: boolean }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Authentication is not configured." };
  }

  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, displayName }),
  });

  const data = (await response.json()) as {
    error?: string;
    userId?: string;
    requiresEmailConfirmation?: boolean;
  };

  if (!response.ok) {
    return { ok: false, error: data.error ?? "Could not create account." };
  }

  if (data.userId) {
    persistAuthUserId(data.userId);

    const supabase = createClient();
    if (supabase) {
      await supabase.auth.getSession();
    }
  }

  return {
    ok: true,
    userId: data.userId,
    requiresEmailConfirmation: data.requiresEmailConfirmation,
  };
}
