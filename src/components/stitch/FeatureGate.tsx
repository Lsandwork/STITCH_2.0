import type { ReactNode } from "react";
import type { SubscriptionTier } from "@/types/database";
import {
  getMinimumTierForFeature,
  getTierConfig,
  hasFeature,
  type FeatureKey,
} from "@/lib/subscriptions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StitchIcon } from "@/components/stitch/StitchIcon";

type FeatureGateProps = {
  tier: SubscriptionTier;
  feature: FeatureKey;
  children: ReactNode;
  fallback?: ReactNode;
  upgradeHref?: string;
  hideUpgradePrompt?: boolean;
};

export function FeatureGate({
  tier,
  feature,
  children,
  fallback,
  upgradeHref = "/settings/subscription",
  hideUpgradePrompt = false,
}: FeatureGateProps) {
  if (hasFeature(tier, feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (hideUpgradePrompt) {
    return (
      <Card className="border-stitch-border bg-stitch-cream/60 text-center">
        <p className="text-sm text-stitch-muted">
          This feature is not included in your current access level.
        </p>
      </Card>
    );
  }

  const requiredTier = getMinimumTierForFeature(feature);
  const requiredLabel = getTierConfig(requiredTier).label;

  return (
    <Card className="border-stitch-rose bg-stitch-cream/60 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-stitch-peach">
        <StitchIcon name="lock" tone="coral" size={24} />
      </div>
      <h3 className="text-base font-semibold text-stitch-ink">
        Upgrade to unlock
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-stitch-muted">
        This feature requires {requiredLabel}. Upgrade your plan to access it.
      </p>
      <Button href={upgradeHref} size="sm" className="mt-4">
        Upgrade to {requiredLabel}
      </Button>
    </Card>
  );
}
