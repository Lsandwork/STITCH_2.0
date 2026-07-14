import Link from "next/link";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Card } from "@/components/ui/Card";
import { StitchIcon } from "@/components/stitch/StitchIcon";

const VISION_LINKS = [
  {
    title: "Live Stitch Check",
    description: "Real-time camera feedback while you crochet.",
    href: "/vision/live",
    icon: "vision" as const,
    tier: "Vision",
  },
  {
    title: "Scan My Work",
    description: "Capture a photo for row detection and mistake analysis.",
    href: "/vision/scan",
    icon: "camera" as const,
    tier: "Vision",
  },
  {
    title: "Scan History",
    description: "Review past scans and suggested fixes.",
    href: "/vision/history",
    icon: "bookmark" as const,
    tier: "Plus",
  },
];

export default function VisionHubPage() {
  return (
    <>
      <PageHeading
        title="Vision Mode"
        description="Camera intelligence for stitch checks, row detection, and pattern reads."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {VISION_LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="h-full transition-transform hover:-translate-y-0.5">
              <StitchIcon name={link.icon} tone="coral" size={28} />
              <h2 className="mt-3 font-semibold text-stitch-ink">{link.title}</h2>
              <p className="mt-1 text-sm text-stitch-muted">{link.description}</p>
              <span className="mt-3 inline-block text-xs font-medium text-stitch-teal">
                {link.tier}
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
