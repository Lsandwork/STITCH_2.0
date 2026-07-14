import { AppHeader } from "@/components/stitch/AppHeader";
import { ContinueProjectCard } from "@/components/stitch/ContinueProjectCard";
import { InsightRail } from "@/components/stitch/InsightRail";
import { LearningRow } from "@/components/stitch/LearningRow";
import { ProjectGrid } from "@/components/stitch/ProjectGrid";
import { QuickActionsPanel } from "@/components/stitch/QuickActionsPanel";
import { getDemoDashboardData } from "@/lib/demo-data";

export default function HomePage() {
  const dashboard = getDemoDashboardData();

  return (
    <>
      <AppHeader
        displayName={dashboard.user.displayName}
        subtitle="Ready to create something beautiful today?"
        avatarUrl={dashboard.user.avatarUrl}
        unreadNotifications={dashboard.unreadNotifications}
      />

      <div className="space-y-8">
        <section aria-labelledby="continue-project-heading">
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2
              id="continue-project-heading"
              className="text-lg font-semibold text-stitch-ink"
            >
              Continue Your Project
            </h2>
          </div>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
            <ContinueProjectCard project={dashboard.continueProject} />
            <QuickActionsPanel compact />
          </div>
        </section>

        <ProjectGrid projects={dashboard.projects} />
        <LearningRow lessons={dashboard.lessons} />

        <div className="xl:hidden">
          <InsightRail
            yarnVault={dashboard.yarnVault}
            recommendations={dashboard.recommendations}
            whatCanIMake={dashboard.whatCanIMake}
            recentScans={dashboard.recentScans}
          />
        </div>
      </div>
    </>
  );
}
