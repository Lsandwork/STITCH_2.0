"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/stitch/AppShell";
import { InsightRail } from "@/components/stitch/InsightRail";
import { getDemoDashboardData } from "@/lib/demo-data";

type AppLayoutClientProps = {
  children: React.ReactNode;
};

export function AppLayoutClient({ children }: AppLayoutClientProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const dashboard = isHome ? getDemoDashboardData() : null;

  return (
    <AppShell
      rightRail={
        dashboard ? (
          <InsightRail
            yarnVault={dashboard.yarnVault}
            recommendations={dashboard.recommendations}
            whatCanIMake={dashboard.whatCanIMake}
            recentScans={dashboard.recentScans}
          />
        ) : undefined
      }
    >
      {children}
    </AppShell>
  );
}
