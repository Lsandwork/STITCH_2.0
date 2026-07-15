import { PageHeading } from "@/components/stitch/PageHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { StitchIcon } from "@/components/stitch/StitchIcon";

export default function YarnRecommendationsPage() {
  return (
    <>
      <PageHeading
        title="Yarn Recommendations"
        description="Projects and palettes matched to your stash."
        backHref="/yarn"
      />
      <EmptyState
        icon={<StitchIcon name="yarn" tone="teal" size={28} />}
        title="Add yarn to get recommendations"
        description="Once your Yarn Vault has a few skeins, Stitch will suggest projects and palettes."
        actionLabel="Add yarn"
        actionHref="/yarn/add"
      />
    </>
  );
}
