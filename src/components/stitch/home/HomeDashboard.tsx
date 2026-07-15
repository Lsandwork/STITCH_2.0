import { HomeHero } from "@/components/stitch/home/HomeHero";
import { FeatureShortcutRow, HomeLeftSidebar } from "@/components/stitch/home/HomeSidebars";
import { HomeRightSidebar } from "@/components/stitch/home/HomeRightSidebar";
import { PatternGridSection } from "@/components/stitch/home/PatternCard";
import { FOR_YOU_PATTERNS, TRENDING_PATTERNS } from "@/lib/home-patterns";

type HomeDashboardProps = {
  displayName: string;
  showUpgrade?: boolean;
};

export function HomeDashboard({
  displayName,
  showUpgrade = true,
}: HomeDashboardProps) {
  return (
    <>
      <HomeHero />
      <FeatureShortcutRow />

      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[var(--stitch-home-left-width)_minmax(0,1fr)_var(--stitch-home-right-width)] lg:gap-10">
          {/* Left rail */}
          <div className="hidden lg:block">
            <HomeLeftSidebar showUpgrade={showUpgrade} />
          </div>

          {/* Center content */}
          <div className="min-w-0 space-y-10">
            <PatternGridSection
              id="trending-now"
              title="Trending Now"
              icon="star"
              patterns={TRENDING_PATTERNS}
            />
            <PatternGridSection
              id="for-you"
              title="For You"
              subtitle="Based on your favorites and activity"
              icon="sparkles"
              patterns={FOR_YOU_PATTERNS}
            />

            {/* Mobile: collections + upgrade below content */}
            <div className="space-y-8 lg:hidden">
              <HomeLeftSidebar showUpgrade={showUpgrade} />
            </div>
          </div>

          {/* Right rail */}
          <div className="hidden xl:block">
            <HomeRightSidebar displayName={displayName} />
          </div>
        </div>

        {/* Tablet: right sidebar below */}
        <div className="mt-10 xl:hidden">
          <HomeRightSidebar displayName={displayName} />
        </div>
      </div>
    </>
  );
}
