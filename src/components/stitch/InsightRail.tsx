import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import type {
  DemoDashboardData,
  DemoRecommendation,
  DemoScan,
  DemoYarnPreview,
} from "@/lib/demo-data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StitchIcon } from "@/components/stitch/StitchIcon";

type InsightRailProps = {
  yarnVault: DemoDashboardData["yarnVault"];
  recommendations: DemoRecommendation[];
  whatCanIMake: DemoRecommendation;
  recentScans: DemoScan[];
};

export function InsightRail({
  yarnVault,
  recommendations,
  whatCanIMake,
  recentScans,
}: InsightRailProps) {
  const featuredRecommendation =
    recommendations.find((rec) => rec.title.includes("Frog Prince")) ??
    recommendations[0];

  return (
    <aside className="stitch-insight-rail space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>My Yarn Vault</CardTitle>
          <StitchIcon name="yarn" tone="coral" />
        </CardHeader>

        <div className="flex items-center gap-2">
          {yarnVault.previewYarns.slice(0, 5).map((yarn) => (
            <YarnPreview key={yarn.id} yarn={yarn} />
          ))}
        </div>

        <p className="mt-3 text-sm font-medium text-stitch-ink">
          {yarnVault.totalYarns} Yarns
        </p>
        {yarnVault.lowStockCount > 0 ? (
          <p className="mt-1 text-xs text-stitch-coral">
            {yarnVault.lowStockCount} running low
          </p>
        ) : null}

        <Link
          href={yarnVault.href}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-stitch-coral hover:underline"
        >
          View Yarn Vault
          <StitchIcon name="arrow-right" tone="coral" size={16} />
        </Link>
      </Card>

      {featuredRecommendation ? (
        <Card>
          <CardHeader>
            <CardTitle>AI Recommends</CardTitle>
            <Badge variant="teal">For you</Badge>
          </CardHeader>

          <div className="overflow-hidden rounded-stitch-md bg-stitch-cream">
            <Image
              src={featuredRecommendation.imageUrl}
              alt={featuredRecommendation.title}
              width={280}
              height={180}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>

          <h4 className="mt-3 text-sm font-semibold text-stitch-ink">
            {featuredRecommendation.title}
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-stitch-muted">
            {featuredRecommendation.description}
          </p>
          <Badge variant="gold" className="mt-2">
            Beginner
          </Badge>

          <Link
            href={featuredRecommendation.href}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-stitch-coral hover:underline"
          >
            View Project
            <StitchIcon name="arrow-right" tone="coral" size={16} />
          </Link>
        </Card>
      ) : null}

      <Card className="bg-gradient-to-br from-stitch-mint/40 to-stitch-paper">
        <CardHeader>
          <CardTitle>What Can I Make?</CardTitle>
          <StitchIcon name="sparkles" tone="teal" />
        </CardHeader>

        <div className="overflow-hidden rounded-stitch-md">
          <Image
            src={whatCanIMake.imageUrl}
            alt={whatCanIMake.title}
            width={280}
            height={160}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>

        <h4 className="mt-3 text-sm font-semibold text-stitch-ink">
          {whatCanIMake.title}
        </h4>
        <p className="mt-1 text-xs leading-relaxed text-stitch-muted">
          {whatCanIMake.description}
        </p>

        <Button
          href={whatCanIMake.href}
          variant="secondary"
          size="sm"
          className="mt-4 w-full border-stitch-teal text-stitch-teal hover:bg-stitch-mint"
        >
          Show Ideas
        </Button>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
          <StitchIcon name="camera" tone="muted" />
        </CardHeader>

        <ul className="space-y-3">
          {recentScans.slice(0, 3).map((scan) => (
            <li key={scan.id}>
              <Link
                href={scan.href}
                className="flex items-center gap-3 rounded-stitch-md p-2 transition-colors hover:bg-stitch-cream"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-stitch-sm bg-stitch-cream">
                  <Image
                    src={scan.imageUrl}
                    alt={scan.projectTitle}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-stitch-ink">
                    {scan.projectTitle}
                  </p>
                  <p className="truncate text-xs text-stitch-muted">
                    {scan.summary}
                  </p>
                  <p className="mt-0.5 text-[11px] text-stitch-muted">
                    {formatDistanceToNow(new Date(scan.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </aside>
  );
}

function YarnPreview({ yarn }: { yarn: DemoYarnPreview }) {
  return (
    <div className="relative">
      <div className="h-9 w-9 overflow-hidden rounded-full border border-stitch-border bg-stitch-cream">
        <Image
          src={yarn.imageUrl}
          alt={yarn.colorName}
          width={36}
          height={36}
          className="h-full w-full object-cover"
        />
      </div>
      {yarn.isLowStock ? (
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-stitch-paper bg-stitch-coral" />
      ) : null}
    </div>
  );
}
