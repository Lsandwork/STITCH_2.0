import { PageHeading } from "@/components/stitch/PageHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { StitchIcon } from "@/components/stitch/StitchIcon";

export default function VisionHistoryPage() {
  return (
    <>
      <PageHeading
        title="Scan History"
        description="Past Vision Mode analyses and row detections."
        backHref="/vision"
        actionLabel="New scan"
        actionHref="/vision/scan"
      />

      <EmptyState
        icon={<StitchIcon name="vision" tone="muted" size={28} />}
        title="No scans yet"
        description="Run your first stitch check to see results here."
        actionLabel="Scan my work"
        actionHref="/vision/scan"
      />
    </>
  );
}
