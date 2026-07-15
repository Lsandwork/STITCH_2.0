import { AppHeader } from "@/components/stitch/AppHeader";
import { InsightRail } from "@/components/stitch/InsightRail";
import { ProjectGrid } from "@/components/stitch/ProjectGrid";
import { QuickActionsPanel } from "@/components/stitch/QuickActionsPanel";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { EmptyState } from "@/components/ui/EmptyState";
import { getServerAppUser } from "@/lib/app-user";
import { Button } from "@/components/ui/Button";

export default async function DashboardPage() {
  const user = await getServerAppUser();
  const displayName = user?.displayName ?? "Maker";

  return (
    <>
      <AppHeader
        displayName={displayName}
        subtitle="Ready to create something beautiful today?"
        avatarUrl={user?.avatarUrl ?? "/assets/stitch/avatars/svg/avatar-1.svg"}
        unreadNotifications={0}
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
            <EmptyState
              icon={<StitchIcon name="projects" tone="coral" size={28} />}
              title="Start your first project"
              description="Create a pattern with AI, upload one you love, or browse the marketplace to find your next make."
              actionLabel="Create a pattern"
              actionHref="/create/pattern"
              className="min-h-[220px] bg-stitch-paper"
            />
            <QuickActionsPanel compact />
          </div>
        </section>

        <ProjectGrid projects={[]} newProjectHref="/create/pattern" />

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-stitch-ink">Continue Learning</h2>
          </div>
          <div className="rounded-stitch-lg border border-dashed border-stitch-border bg-stitch-paper px-6 py-10 text-center">
            <p className="text-sm text-stitch-muted">
              Browse lessons and build skills at your own pace.
            </p>
            <Button href="/learn" variant="secondary" size="sm" className="mt-4">
              Explore lessons
            </Button>
          </div>
        </section>

        <div className="xl:hidden">
          <InsightRail
            yarnVault={{
              totalYarns: 0,
              lowStockCount: 0,
              previewYarns: [],
              href: "/yarn",
            }}
            recommendations={[]}
            whatCanIMake={{
              id: "empty",
              title: "Add yarn to get ideas",
              description: "Build your Yarn Vault and Stitch will suggest projects.",
              imageUrl: "/assets/stitch/illustrations/svg/yarn-teal.svg",
              href: "/yarn/add",
              reason: "Get started",
            }}
            recentScans={[]}
          />
        </div>
      </div>
    </>
  );
}
