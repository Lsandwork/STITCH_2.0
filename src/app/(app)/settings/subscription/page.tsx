import { PageHeading } from "@/components/stitch/PageHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SUBSCRIPTION_TIERS } from "@/lib/constants";
import { DEMO_USER } from "@/lib/demo-data";

export default function SubscriptionSettingsPage() {
  const currentTier = DEMO_USER.subscriptionTier;

  return (
    <>
      <PageHeading
        title="Subscription"
        description="Manage your Stitch plan and billing."
        backHref="/settings"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {SUBSCRIPTION_TIERS.map((tier) => {
          const isCurrent = tier.id === currentTier;
          const isHighlighted = tier.highlighted;

          return (
            <Card
              key={tier.id}
              padding="lg"
              className={
                isHighlighted
                  ? "border-stitch-coral ring-2 ring-stitch-coral/20"
                  : undefined
              }
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                {isCurrent ? <Badge variant="teal">Current</Badge> : null}
              </div>
              <p className="mt-1 text-2xl font-bold text-stitch-coral">{tier.price}</p>
              <p className="mt-2 text-sm text-stitch-muted">{tier.description}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="text-stitch-teal">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              {!isCurrent ? (
                <Button href="/settings/subscription" variant="secondary" className="mt-6 w-full">
                  Upgrade to {tier.name}
                </Button>
              ) : (
                <p className="mt-6 text-center text-xs text-stitch-muted">
                  Demo mode — billing not connected
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}
