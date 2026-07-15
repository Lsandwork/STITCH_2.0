"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/stitch/AppShell";
import { InsightRail } from "@/components/stitch/InsightRail";
import { SubscriptionProvider } from "@/components/providers/SubscriptionProvider";
import type { SubscriptionAccess } from "@/lib/subscription-access";

type AppLayoutClientProps = {
  children: React.ReactNode;
  isAdmin?: boolean;
  initialSubscription?: SubscriptionAccess;
};

const EMPTY_INSIGHT_RAIL = {
  yarnVault: {
    totalYarns: 0,
    lowStockCount: 0,
    previewYarns: [],
    href: "/yarn",
  },
  recommendations: [],
  whatCanIMake: {
    id: "empty",
    title: "Add yarn to get ideas",
    description: "Build your Yarn Vault and Stitch will suggest projects.",
    imageUrl: "/assets/stitch/illustrations/svg/yarn-teal.svg",
    href: "/yarn/add",
    reason: "Get started",
  },
  recentScans: [],
};

export function AppLayoutClient({
  children,
  isAdmin: serverIsAdmin = false,
  initialSubscription,
}: AppLayoutClientProps) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";
  const [isAdmin, setIsAdmin] = useState(serverIsAdmin);

  useEffect(() => {
    setIsAdmin(serverIsAdmin);
  }, [serverIsAdmin]);

  useEffect(() => {
    let cancelled = false;

    async function refreshAdminStatus() {
      try {
        const response = await fetch("/api/profile/me");
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled && data.adminRole === "admin") {
          setIsAdmin(true);
        }
      } catch {
        /* ignore */
      }
    }

    void refreshAdminStatus();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SubscriptionProvider initial={initialSubscription}>
      <AppShell
        isAdmin={isAdmin}
        rightRail={
          isDashboard ? <InsightRail {...EMPTY_INSIGHT_RAIL} /> : undefined
        }
      >
        {children}
      </AppShell>
    </SubscriptionProvider>
  );
}
