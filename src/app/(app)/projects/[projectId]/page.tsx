import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DEMO_PROJECTS } from "@/lib/demo-data";
import { formatDuration } from "@/lib/utils";

type Props = { params: Promise<{ projectId: string }> };

export default async function ProjectDetailPage({ params }: Props) {
  const { projectId } = await params;
  const project = DEMO_PROJECTS.find((p) => p.id === projectId);

  if (!project) notFound();

  return (
    <>
      <PageHeading title={project.title} backHref="/projects" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding="lg">
          <div className="mx-auto max-w-xs overflow-hidden rounded-stitch-xl bg-stitch-cream">
            <Image
              src={project.imageUrl}
              alt={project.title}
              width={400}
              height={400}
              className="aspect-square w-full object-cover"
            />
          </div>
        </Card>

        <Card padding="lg" className="space-y-4">
          <Badge>{project.status}</Badge>
          <ProgressBar value={project.progressPercent} label={`${project.progressPercent}% complete`} />
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-stitch-muted">Yarn</dt>
              <dd className="font-medium">{project.yarnName}</dd>
            </div>
            <div>
              <dt className="text-stitch-muted">Hook</dt>
              <dd className="font-medium">{project.hookSize}</dd>
            </div>
            <div>
              <dt className="text-stitch-muted">Progress</dt>
              <dd className="font-medium">
                Row {project.currentRow} / {project.totalRows}
              </dd>
            </div>
            <div>
              <dt className="text-stitch-muted">Time spent</dt>
              <dd className="font-medium">{formatDuration(project.timeSpentMinutes)}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button href={project.href}>Open workspace</Button>
            <Button href="/vision/scan" variant="secondary">
              Scan work
            </Button>
            <Button href="/tutor" variant="ghost">
              Ask Tutor
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
