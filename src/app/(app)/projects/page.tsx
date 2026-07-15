import { PageHeading } from "@/components/stitch/PageHeading";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ProjectsPage() {
  return (
    <>
      <PageHeading
        title="My Projects"
        description="All your active, paused, and completed crochet projects."
        actionLabel="New project"
        actionHref="/create/pattern"
      />

      <EmptyState
        icon={<StitchIcon name="projects" tone="coral" size={28} />}
        title="No projects yet"
        description="Start your first crochet project — generate a pattern with AI or upload one you already love."
        actionLabel="Create a pattern"
        actionHref="/create/pattern"
      />
    </>
  );
}
