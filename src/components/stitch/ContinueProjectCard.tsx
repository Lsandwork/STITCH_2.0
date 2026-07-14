import Image from "next/image";
import Link from "next/link";
import type { DemoProject } from "@/lib/demo-data";
import { formatDuration, formatProgress } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StitchIcon } from "@/components/stitch/StitchIcon";

type ContinueProjectCardProps = {
  project: DemoProject;
};

export function ContinueProjectCard({ project }: ContinueProjectCardProps) {
  return (
    <Card padding="lg" className="overflow-hidden">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch">
        <div className="relative mx-auto w-full max-w-[220px] shrink-0 overflow-hidden rounded-stitch-lg bg-stitch-cream lg:mx-0 lg:max-w-[200px]">
          <Image
            src={project.imageUrl}
            alt={project.title}
            width={400}
            height={400}
            className="aspect-square w-full object-cover"
            priority
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-stitch-ink">
                {project.title}
              </h2>
              <p className="mt-1 text-sm text-stitch-muted">
                {formatProgress(project.currentRow, project.totalRows)}
              </p>
            </div>
            <Link
              href={`/projects/${project.id}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-stitch-sm hover:bg-stitch-peach"
              aria-label={`Edit ${project.title}`}
            >
              <StitchIcon name="edit" tone="muted" size={18} />
            </Link>
          </div>

          <div className="mt-4">
            <ProgressBar
              value={project.progressPercent}
              label={`${project.progressPercent}% Complete`}
            />
          </div>

          {project.rowPreview ? (
            <p className="mt-4 rounded-stitch-md bg-stitch-cream px-4 py-3 font-mono text-sm leading-relaxed text-stitch-ink">
              {project.rowPreview}
            </p>
          ) : null}

          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-stitch-md bg-stitch-cream px-3 py-2.5">
              <p className="text-xs text-stitch-muted">Yarn</p>
              <p className="mt-0.5 font-medium text-stitch-ink">
                {project.yarnName}
              </p>
            </div>
            <div className="rounded-stitch-md bg-stitch-cream px-3 py-2.5">
              <p className="text-xs text-stitch-muted">Hook</p>
              <p className="mt-0.5 font-medium text-stitch-ink">
                {project.hookSize}
              </p>
            </div>
            <div className="rounded-stitch-md bg-stitch-cream px-3 py-2.5">
              <p className="text-xs text-stitch-muted">Time</p>
              <p className="mt-0.5 font-medium text-stitch-ink">
                {formatDuration(project.timeSpentMinutes)}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button href={project.href} className="flex-1">
              Continue Crocheting
            </Button>
            <Button
              href={`${project.href}?voice=1`}
              variant="secondary"
              size="icon"
              aria-label="Voice pattern player"
            >
              <StitchIcon name="microphone" tone="coral" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
