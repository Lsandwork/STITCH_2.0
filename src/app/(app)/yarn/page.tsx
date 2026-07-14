import Image from "next/image";
import Link from "next/link";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DEMO_YARN_PREVIEW, getDemoDashboardData } from "@/lib/demo-data";

export default function YarnVaultPage() {
  const vault = getDemoDashboardData().yarnVault;

  return (
    <>
      <PageHeading
        title="Yarn Vault"
        description={`${vault.totalYarns} yarns tracked · ${vault.lowStockCount} running low`}
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_YARN_PREVIEW.map((yarn) => (
          <Card key={yarn.id}>
            <div className="flex gap-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-stitch-md bg-stitch-cream">
                <Image
                  src={yarn.imageUrl}
                  alt={yarn.colorName}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-stitch-ink">{yarn.name}</h3>
                <p className="text-sm text-stitch-muted">{yarn.colorName}</p>
                {yarn.isLowStock ? (
                  <p className="mt-1 text-xs font-medium text-stitch-coral">Running low</p>
                ) : null}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 bg-stitch-mint/30">
        <p className="text-sm text-stitch-muted">
          Need a substitute?{" "}
          <Link href="/yarn/substitute" className="font-medium text-stitch-teal hover:underline">
            Compare compatible yarns
          </Link>
        </p>
      </Card>
    </>
  );
}
