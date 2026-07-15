import { PageHeading } from "@/components/stitch/PageHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import {
  BILLING_PROMO,
  getAnnualSavingsCents,
  getBillingPlan,
} from "@/lib/billing";
import { getTierConfig } from "@/lib/subscriptions";
import { SUBSCRIPTION_TIERS } from "@/lib/constants";

import { getServerAppUser } from "@/lib/app-user";

export default async function SubscriptionSettingsPage() {
  const user = await getServerAppUser();
  const currentTier = user?.subscriptionTier ?? "free";
  const lifetimeAccess = user?.lifetimeAccess === true;
  const accessLabel = lifetimeAccess
    ? `${getTierConfig(currentTier).label} (Lifetime)`
    : getTierConfig(currentTier).label;

  return (
    <>
      <PageHeading
        title="Subscription"
        description={
          lifetimeAccess
            ? "You have lifetime access to Stitch features."
            : "Manage your Stitch plan and billing."
        }
        backHref="/settings"
      />

      {lifetimeAccess ? (
        <Card padding="lg" className="mb-6 border-stitch-teal/40 bg-stitch-mint/40">
          <div className="flex items-center gap-3">
            <StitchIcon name="crown" tone="teal" size={24} />
            <div>
              <h2 className="text-lg font-semibold text-stitch-ink">Lifetime access active</h2>
              <p className="text-sm text-stitch-muted">
                Your account has permanent {accessLabel} access granted by an administrator.
              </p>
            </div>
          </div>
        </Card>
      ) : null}

      {!lifetimeAccess ? (
        <Card
          padding="lg"
          className="mb-6 border-stitch-gold/40 bg-gradient-to-br from-stitch-peach/70 to-stitch-mint/30"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stitch-paper shadow-stitch-card">
              <StitchIcon name="crown" tone="gold" size={24} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-stitch-ink">
                  {BILLING_PROMO.title}
                </h2>
                <Badge variant="gold">New member offer</Badge>
              </div>
              <p className="mt-2 text-sm font-medium text-stitch-ink">
                {BILLING_PROMO.headline}
              </p>
              <p className="mt-2 text-sm text-stitch-muted">{BILLING_PROMO.description}</p>
              <p className="mt-3 text-xs text-stitch-muted">{BILLING_PROMO.lockInNote}</p>
            </div>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {SUBSCRIPTION_TIERS.map((tier) => {
          const isCurrent = tier.id === currentTier;
          const isHighlighted = !lifetimeAccess && tier.highlighted;
          const plan = getBillingPlan(tier.id);
          const annualSavings = getAnnualSavingsCents(plan);

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
                {isCurrent ? (
                  <Badge variant={lifetimeAccess ? "teal" : "default"}>
                    {lifetimeAccess ? "Lifetime" : "Current"}
                  </Badge>
                ) : null}
              </div>
              {lifetimeAccess ? (
                <p className="mt-1 text-sm text-stitch-muted">Included with lifetime access</p>
              ) : (
                <p className="mt-1 text-2xl font-bold text-stitch-coral">{tier.price}</p>
              )}
              {!lifetimeAccess && tier.promoEligible ? (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-stitch-muted">
                    or {tier.annualPrice} billed annually
                  </p>
                  {annualSavings > 0 ? (
                    <p className="text-xs font-medium text-stitch-teal">
                      Save ${(annualSavings / 100).toFixed(2)} per year with annual billing
                    </p>
                  ) : null}
                  <p className="text-xs font-medium text-stitch-coral">
                    Founder rate locked for life through Dec 31, 2026
                  </p>
                </div>
              ) : null}
              <p className="mt-2 text-sm text-stitch-muted">{tier.description}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="text-stitch-teal">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              {!lifetimeAccess && !isCurrent ? (
                <div className="mt-6 space-y-2">
                  {tier.promoEligible ? (
                    <>
                      <Button href="/settings/subscription" className="w-full">
                        Subscribe monthly — {tier.price}
                      </Button>
                      <Button
                        href="/settings/subscription"
                        variant="secondary"
                        className="w-full"
                      >
                        Pay annually — {tier.annualPrice}
                      </Button>
                    </>
                  ) : (
                    <Button href="/settings/subscription" variant="secondary" className="w-full">
                      Current plan
                    </Button>
                  )}
                </div>
              ) : isCurrent && !lifetimeAccess ? (
                <p className="mt-6 text-center text-xs text-stitch-muted">
                  Demo mode — billing not connected. Standard pricing begins{" "}
                  {BILLING_PROMO.standardPricingStarts}.
                </p>
              ) : null}
            </Card>
          );
        })}
      </div>
    </>
  );
}
