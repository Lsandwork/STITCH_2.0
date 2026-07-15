"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/stitch/AppShell";
import { SubscriptionProvider } from "@/components/providers/SubscriptionProvider";
import type { SubscriptionAccess } from "@/lib/subscription-access";

type AppLayoutClientProps = {
  children: React.ReactNode;
  isAdmin?: boolean;
  initialSubscription?: SubscriptionAccess;
};

export function AppLayoutClient({
  children,
  isAdmin: serverIsAdmin = false,
  initialSubscription,
}: AppLayoutClientProps) {
  const pathname = usePathname();
  const isHomeDashboard = pathname === "/dashboard";
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
      {isHomeDashboard ? (
        children
      ) : (
        <AppShell isAdmin={isAdmin}>{children}</AppShell>
      )}
    </SubscriptionProvider>
  );
}
