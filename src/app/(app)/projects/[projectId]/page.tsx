import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getDemoProject } from "@/lib/demo-data";
import { formatDuration } from "@/lib/utils";

type Props = { params: Promise<{ projectId: string }> };

export default async function ProjectDetailPage({ params }: Props) {
  const { projectId } = await params;
  const project = getDemoProject(projectId);

  if (!project) notFound();

  return (
    <>
      <PageHeading title={project.title} backHref="/projects" />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card padding="lg">
          <div className="overflow-hidden rounded-stitch-xl bg-stitch-cream">
            <Image
              src={project.imageUrl}
              alt={`${project.title} — finished crochet project`}
              width={600}
              height={600}
              className="aspect-square w-full object-cover"
              priority
            />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-stitch-muted">
            {project.description}
          </p>
        </Card>

        <div className="space-y-4">
          <Card padding="lg" className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{project.status}</Badge>
              <Badge variant="teal">{project.skillLevel}</Badge>
              <Badge variant="gold">{project.finishedSize}</Badge>
            </div>

            <ProgressBar
              value={project.progressPercent}
              label={`${project.progressPercent}% complete`}
            />

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
                  Row {project.currentRow} of {project.totalRows}
                </dd>
              </div>
              <div>
                <dt className="text-stitch-muted">Time spent</dt>
                <dd className="font-medium">
                  {formatDuration(project.timeSpentMinutes)}
                </dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button href={project.href}>Continue crocheting</Button>
              <Button href="/vision/scan" variant="secondary">
                Scan work
              </Button>
              <Button href="/tutor" variant="ghost">
                Ask Tutor
              </Button>
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="mb-3 text-base font-semibold text-stitch-ink">
              Materials
            </h3>
            <ul className="space-y-1.5 text-sm text-stitch-ink">
              {project.materials.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-stitch-coral">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card padding="lg">
            <h3 className="mb-3 text-base font-semibold text-stitch-ink">
              How to make it
            </h3>
            <ol className="space-y-2 text-sm leading-relaxed text-stitch-ink">
              {project.overview.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stitch-peach text-xs font-semibold text-stitch-coral">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </>
  );
}
