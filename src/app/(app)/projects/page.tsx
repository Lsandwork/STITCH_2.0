import Link from "next/link";
import Image from "next/image";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { DEMO_PROJECTS } from "@/lib/demo-data";

export default function ProjectsPage() {
  return (
    <>
      <PageHeading
        title="My Projects"
        description="All your active, paused, and completed crochet projects."
        actionLabel="New project"
        actionHref="/create/pattern"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_PROJECTS.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <article className="stitch-project-card transition-transform hover:-translate-y-0.5">
              <div className="aspect-[4/3] overflow-hidden bg-stitch-cream">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  width={400}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-stitch-ink">{project.title}</h2>
                  <Badge>{project.status}</Badge>
                </div>
                <ProgressBar value={project.progressPercent} size="sm" />
                <p className="mt-2 text-xs text-stitch-muted">
                  Row {project.currentRow} of {project.totalRows}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>

      <Button href="/create" variant="secondary" className="mt-6">
        Start a new project
      </Button>
    </>
  );
}
