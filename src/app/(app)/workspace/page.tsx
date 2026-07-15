import { PageHeading } from "@/components/stitch/PageHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { StitchIcon } from "@/components/stitch/StitchIcon";

export default function WorkspaceIndexPage() {
  return (
    <>
      <PageHeading
        title="Pattern Workspace"
        description="Follow, edit, and track your rows — pick a project to open your workspace."
        actionLabel="New project"
        actionHref="/create/pattern"
      />

      <EmptyState
        icon={<StitchIcon name="pattern" tone="teal" size={28} />}
        title="No active workspaces"
        description="Create a project to open your pattern workspace with row tracking and notes."
        actionLabel="Start a project"
        actionHref="/create/pattern"
      />
    </>
  );
}
