import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { DEMO_RECENT_SCANS } from "@/lib/demo-data";

export default function VisionHistoryPage() {
  const scans = DEMO_RECENT_SCANS;

  return (
    <>
      <PageHeading
        title="Scan History"
        description="Past Vision Mode analyses and row detections."
        backHref="/vision"
        actionLabel="New scan"
        actionHref="/vision/scan"
      />

      {scans.length === 0 ? (
        <EmptyState
          title="No scans yet"
          description="Run your first stitch check to see results here."
          actionLabel="Scan my work"
          actionHref="/vision/scan"
        />
      ) : (
        <ul className="space-y-3">
          {scans.map((scan) => (
            <li key={scan.id}>
              <Link href={scan.href}>
                <Card className="flex gap-4 transition-colors hover:bg-stitch-cream/50">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-stitch-md bg-stitch-cream">
                    <Image
                      src={scan.imageUrl}
                      alt={scan.projectTitle}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-stitch-ink">{scan.projectTitle}</p>
                    <p className="text-sm text-stitch-muted">{scan.scanType}</p>
                    <p className="mt-1 line-clamp-2 text-sm">{scan.summary}</p>
                    <p className="mt-1 text-xs text-stitch-muted">
                      {formatDistanceToNow(new Date(scan.createdAt), { addSuffix: true })}
                      {" · "}
                      {Math.round(scan.confidence * 100)}% confidence
                    </p>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
