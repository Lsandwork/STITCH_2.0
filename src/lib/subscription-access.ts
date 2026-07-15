import type { SubscriptionTier } from "@/types/database";
import { isTierAtLeast } from "@/lib/subscriptions";

export type SubscriptionAccess = {
  subscriptionTier: SubscriptionTier;
  lifetimeAccess: boolean;
};

export function resolveFeatureTier({
  subscriptionTier,
  lifetimeAccess,
}: SubscriptionAccess): SubscriptionTier {
  if (lifetimeAccess && subscriptionTier === "free") {
    return "stitch_vision";
  }

  return subscriptionTier;
}

export function shouldShowUpgradePrompts({
  subscriptionTier,
  lifetimeAccess,
}: SubscriptionAccess): boolean {
  if (lifetimeAccess) {
    return false;
  }

  return !isTierAtLeast(subscriptionTier, "stitch_vision");
}
