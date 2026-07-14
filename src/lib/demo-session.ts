import { DEMO_USER } from "@/lib/demo-data";
import { isDemoModeEnabled } from "@/lib/constants";
import type { SubscriptionTier } from "@/types/database";

export const DEMO_SESSION_KEY = "stitch-demo-session";
export const DEMO_SESSION_COOKIE = "stitch-demo-auth";

export type DemoSession = {
  userId: string;
  email: string;
  displayName: string;
  subscriptionTier: SubscriptionTier;
  loggedInAt: string;
};

export function isClientDemoMode(): boolean {
  if (typeof window === "undefined") return isDemoModeEnabled();
  return (
    isDemoModeEnabled() ||
    localStorage.getItem(DEMO_SESSION_KEY) !== null ||
    document.cookie.includes(`${DEMO_SESSION_COOKIE}=1`)
  );
}

export function getDemoSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoSession;
  } catch {
    return null;
  }
}

export function setDemoSession(
  overrides?: Partial<Pick<DemoSession, "email" | "displayName">>,
): DemoSession {
  const session: DemoSession = {
    userId: DEMO_USER.id,
    email: overrides?.email ?? DEMO_USER.email,
    displayName: overrides?.displayName ?? DEMO_USER.displayName,
    subscriptionTier: DEMO_USER.subscriptionTier,
    loggedInAt: new Date().toISOString(),
  };

  localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
  document.cookie = `${DEMO_SESSION_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  return session;
}

export function clearDemoSession(): void {
  localStorage.removeItem(DEMO_SESSION_KEY);
  document.cookie = `${DEMO_SESSION_COOKIE}=; path=/; max-age=0`;
}

export function getSubscriptionTier(): SubscriptionTier {
  return getDemoSession()?.subscriptionTier ?? DEMO_USER.subscriptionTier;
}
