import type { SubscriptionTier } from "@/types/database";

export type FeatureKey =
  | "active_projects"
  | "pattern_uploads"
  | "tutor_messages"
  | "yarn_vault"
  | "ai_pattern_generation"
  | "pattern_translation"
  | "voice_pattern_player"
  | "yarn_substitution"
  | "color_studio"
  | "pdf_export"
  | "camera_analysis"
  | "smart_row_detection"
  | "mistake_detection"
  | "photo_to_pattern"
  | "advanced_scan_history";

type FeatureLimit = number | "unlimited";

type TierConfig = {
  label: string;
  rank: number;
  limits: Partial<Record<FeatureKey, FeatureLimit>>;
  features: FeatureKey[];
};

const TIER_CONFIG: Record<SubscriptionTier, TierConfig> = {
  free: {
    label: "Free",
    rank: 0,
    limits: {
      active_projects: 3,
      pattern_uploads: 3,
      tutor_messages: 10,
    },
    features: ["active_projects", "yarn_vault"],
  },
  stitch_plus: {
    label: "Stitch Plus",
    rank: 1,
    limits: {
      active_projects: "unlimited",
      pattern_uploads: "unlimited",
      tutor_messages: "unlimited",
    },
    features: [
      "active_projects",
      "yarn_vault",
      "ai_pattern_generation",
      "pattern_translation",
      "voice_pattern_player",
      "yarn_substitution",
      "color_studio",
      "pdf_export",
    ],
  },
  stitch_vision: {
    label: "Stitch Vision",
    rank: 2,
    limits: {
      active_projects: "unlimited",
      pattern_uploads: "unlimited",
      tutor_messages: "unlimited",
    },
    features: [
      "active_projects",
      "yarn_vault",
      "ai_pattern_generation",
      "pattern_translation",
      "voice_pattern_player",
      "yarn_substitution",
      "color_studio",
      "pdf_export",
      "camera_analysis",
      "smart_row_detection",
      "mistake_detection",
      "photo_to_pattern",
      "advanced_scan_history",
    ],
  },
};

export function getTierConfig(tier: SubscriptionTier): TierConfig {
  return TIER_CONFIG[tier];
}

export function hasFeature(tier: SubscriptionTier, feature: FeatureKey): boolean {
  return TIER_CONFIG[tier].features.includes(feature);
}

export function getFeatureLimit(
  tier: SubscriptionTier,
  feature: FeatureKey,
): FeatureLimit | null {
  return TIER_CONFIG[tier].limits[feature] ?? null;
}

export function canUseFeature(
  tier: SubscriptionTier,
  feature: FeatureKey,
  currentUsage = 0,
): boolean {
  if (!hasFeature(tier, feature)) {
    return false;
  }

  const limit = getFeatureLimit(tier, feature);
  if (limit === null || limit === "unlimited") {
    return true;
  }

  return currentUsage < limit;
}

export function getMinimumTierForFeature(feature: FeatureKey): SubscriptionTier {
  const tiers: SubscriptionTier[] = ["free", "stitch_plus", "stitch_vision"];
  return (
    tiers.find((tier) => hasFeature(tier, feature)) ?? "stitch_vision"
  );
}

export function isTierAtLeast(
  current: SubscriptionTier,
  required: SubscriptionTier,
): boolean {
  return TIER_CONFIG[current].rank >= TIER_CONFIG[required].rank;
}

export function getUpgradeTarget(
  tier: SubscriptionTier,
  feature: FeatureKey,
): SubscriptionTier | null {
  if (hasFeature(tier, feature)) {
    return null;
  }
  return getMinimumTierForFeature(feature);
}
