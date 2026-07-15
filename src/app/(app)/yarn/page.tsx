import { PageHeading } from "@/components/stitch/PageHeading";
import { Button } from "@/components/ui/Button";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { EmptyState } from "@/components/ui/EmptyState";

export default function YarnVaultPage() {
  return (
    <>
      <PageHeading
        title="Yarn Vault"
        description="Track your stash, substitutions, and project recommendations."
        actionLabel="Add yarn"
        actionHref="/yarn/add"
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <Button href="/yarn/substitute" variant="secondary">
          Substitute yarn
        </Button>
        <Button href="/yarn/recommendations" variant="secondary">
          Recommendations
        </Button>
      </div>

      <EmptyState
        icon={<StitchIcon name="yarn" tone="teal" size={28} />}
        title="Your Yarn Vault is empty"
        description="Add your first skein to track colors, weights, and get smart project ideas."
        actionLabel="Add yarn"
        actionHref="/yarn/add"
      />
    </>
  );
}
