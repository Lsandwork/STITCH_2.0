import Image from "next/image";
import Link from "next/link";
import type { DemoProject } from "@/lib/demo-data";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StitchIcon } from "@/components/stitch/StitchIcon";

type ProjectGridProps = {
  projects: DemoProject[];
  title?: string;
  newProjectHref?: string;
  maxVisible?: number;
};

function statusVariant(
  status: DemoProject["status"],
): "coral" | "teal" | "default" | "gold" | "success" {
  switch (status) {
    case "In Progress":
      return "teal";
    case "Paused":
      return "gold";
    case "Completed":
      return "success";
    default:
      return "default";
  }
}

export function ProjectGrid({
  projects,
  title = "My Projects",
  newProjectHref = "/projects/new",
  maxVisible = 4,
}: ProjectGridProps) {
  const visibleProjects = projects.slice(0, maxVisible);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-stitch-ink">{title}</h2>
        <Link
          href="/projects"
          className="text-sm font-medium text-stitch-coral hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {visibleProjects.map((project) => (
          <Link
            key={project.id}
            href={project.href}
            className="stitch-project-card group transition-transform hover:-translate-y-0.5"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-stitch-cream">
              <Image
                src={project.imageUrl}
                alt={project.title}
                width={320}
                height={240}
                className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
              />
            </div>
            <div className="p-3.5">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="line-clamp-1 text-sm font-semibold text-stitch-ink">
                  {project.title}
                </h3>
                <Badge variant={statusVariant(project.status)} className="shrink-0">
                  {project.status}
                </Badge>
              </div>
              <ProgressBar value={project.progressPercent} size="sm" />
            </div>
          </Link>
        ))}

        <Link
          href={newProjectHref}
          className="flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-stitch-md border-2 border-dashed border-stitch-border bg-stitch-paper p-4 text-center transition-colors hover:border-stitch-coral hover:bg-stitch-peach/40"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-stitch-peach">
            <StitchIcon name="plus" tone="coral" size={24} />
          </span>
          <span className="text-sm font-semibold text-stitch-ink">
            New Project
          </span>
        </Link>
      </div>
    </section>
  );
}
