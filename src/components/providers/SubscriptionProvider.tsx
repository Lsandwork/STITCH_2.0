"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isDemoModeEnabled } from "@/lib/constants";
import { DEMO_USER } from "@/lib/demo-data";
import {
  clearStaleDemoSessionIfDisabled,
  getDemoSession,
} from "@/lib/demo-session";
import {
  resolveFeatureTier,
  shouldShowUpgradePrompts,
  type SubscriptionAccess,
} from "@/lib/subscription-access";
import { buildUserHandle } from "@/lib/user-handle";
import type { SubscriptionTier } from "@/types/database";

export type CurrentUser = {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  handle: string;
};

type SubscriptionState = SubscriptionAccess & {
  featureTier: SubscriptionTier;
  showUpgradePrompts: boolean;
  isLoading: boolean;
  user: CurrentUser | null;
  refresh: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionState | null>(null);

type SubscriptionProviderProps = {
  children: ReactNode;
  initial?: SubscriptionAccess;
};

function getDemoCurrentUser(): CurrentUser {
  const session = getDemoSession();
  const email = session?.email ?? DEMO_USER.email;
  const displayName =
    session?.displayName ??
    email.split("@")[0] ??
    DEMO_USER.displayName;

  return {
    id: session?.userId ?? DEMO_USER.id,
    displayName,
    email,
    avatarUrl: DEMO_USER.avatarUrl,
    handle: buildUserHandle(email),
  };
}

function getDemoSubscription(): SubscriptionAccess {
  const session = getDemoSession();
  return {
    subscriptionTier: session?.subscriptionTier ?? DEMO_USER.subscriptionTier,
    lifetimeAccess: false,
  };
}

export function SubscriptionProvider({
  children,
  initial,
}: SubscriptionProviderProps) {
  const [subscription, setSubscription] = useState<SubscriptionAccess>(
    initial ?? { subscriptionTier: "free", lifetimeAccess: false },
  );
  const [user, setUser] = useState<CurrentUser | null>(
    isDemoModeEnabled() ? getDemoCurrentUser() : null,
  );
  const [isLoading, setIsLoading] = useState(!initial);

  const refresh = useCallback(async () => {
    if (isDemoModeEnabled()) {
      setSubscription(getDemoSubscription());
      setUser(getDemoCurrentUser());
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/profile/me");
      if (!response.ok) {
        setUser(null);
        return;
      }
      const data = (await response.json()) as {
        id?: string;
        displayName?: string;
        email?: string;
        avatarUrl?: string;
        subscriptionTier?: SubscriptionTier;
        lifetimeAccess?: boolean;
      };

      setSubscription({
        subscriptionTier: data.subscriptionTier ?? "free",
        lifetimeAccess: data.lifetimeAccess === true,
      });

      if (data.id && data.email) {
        const email = data.email;
        setUser({
          id: data.id,
          displayName:
            data.displayName?.trim() || email.split("@")[0] || "Maker",
          email,
          avatarUrl: data.avatarUrl ?? DEMO_USER.avatarUrl,
          handle: buildUserHandle(email),
        });
      }
    } catch {
      /* ignore */
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    clearStaleDemoSessionIfDisabled();
    void refresh();
  }, [refresh]);

  const value = useMemo<SubscriptionState>(
    () => ({
      ...subscription,
      featureTier: resolveFeatureTier(subscription),
      showUpgradePrompts: shouldShowUpgradePrompts(subscription),
      isLoading,
      user,
      refresh,
    }),
    [subscription, isLoading, user, refresh],
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(): SubscriptionState {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within SubscriptionProvider");
  }
  return context;
}

/** Signed-in maker profile for posts, comments, uploads, etc. */
export function useCurrentUser(): CurrentUser | null {
  const { user, isLoading } = useSubscription();
  if (user) return user;

  if (isDemoModeEnabled()) {
    return getDemoCurrentUser();
  }

  // Never invent a signed-in identity outside demo mode.
  if (isLoading) return null;
  return null;
}
