import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DEMO_RECENT_SCANS } from "@/lib/demo-data";

type Props = { params: Promise<{ scanId: string }> };

export default async function VisionScanDetailPage({ params }: Props) {
  const { scanId } = await params;
  const scan = DEMO_RECENT_SCANS.find((s) => s.id === scanId);

  if (!scan) notFound();

  return (
    <>
      <PageHeading
        title={scan.projectTitle}
        description={`${scan.scanType} · ${Math.round(scan.confidence * 100)}% confidence`}
        backHref="/vision/history"
      />
      <Card padding="lg" className="max-w-2xl">
        <div className="overflow-hidden rounded-stitch-lg bg-stitch-cream">
          <Image
            src={scan.imageUrl}
            alt={scan.projectTitle}
            width={640}
            height={360}
            className="aspect-video w-full object-cover"
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-stitch-ink">{scan.summary}</p>
        <div className="mt-6 flex gap-3">
          <Button href="/vision/scan">Rescan</Button>
          <Button href="/workspace/demo-dachshund" variant="secondary">
            Open workspace
          </Button>
          <Button href="/tutor" variant="ghost">
            Ask Tutor
          </Button>
        </div>
      </Card>
    </>
  );
}
