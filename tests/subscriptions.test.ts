import { describe, expect, it } from "vitest";
import {
  canUseFeature,
  getFeatureLimit,
  getMinimumTierForFeature,
  getUpgradeTarget,
  hasFeature,
  isTierAtLeast,
} from "@/lib/subscriptions";

describe("subscription feature gates", () => {
  it("grants basic features on free tier", () => {
    expect(hasFeature("free", "active_projects")).toBe(true);
    expect(hasFeature("free", "yarn_vault")).toBe(true);
    expect(hasFeature("free", "ai_pattern_generation")).toBe(false);
  });

  it("unlocks AI features on stitch_plus", () => {
    expect(hasFeature("stitch_plus", "ai_pattern_generation")).toBe(true);
    expect(hasFeature("stitch_plus", "yarn_substitution")).toBe(true);
    expect(hasFeature("stitch_plus", "camera_analysis")).toBe(false);
  });

  it("unlocks vision features on stitch_vision", () => {
    expect(hasFeature("stitch_vision", "camera_analysis")).toBe(true);
    expect(hasFeature("stitch_vision", "mistake_detection")).toBe(true);
    expect(hasFeature("stitch_vision", "photo_to_pattern")).toBe(true);
  });

  it("enforces numeric limits on free tier", () => {
    expect(getFeatureLimit("free", "active_projects")).toBe(3);
    expect(canUseFeature("free", "active_projects", 2)).toBe(true);
    expect(canUseFeature("free", "active_projects", 3)).toBe(false);
    expect(hasFeature("free", "tutor_messages")).toBe(false);
    expect(canUseFeature("free", "tutor_messages", 0)).toBe(false);
  });

  it("treats plus tier limits as unlimited", () => {
    expect(getFeatureLimit("stitch_plus", "active_projects")).toBe("unlimited");
    expect(canUseFeature("stitch_plus", "active_projects", 999)).toBe(true);
  });

  it("returns minimum tier required for a feature", () => {
    expect(getMinimumTierForFeature("yarn_vault")).toBe("free");
    expect(getMinimumTierForFeature("color_studio")).toBe("stitch_plus");
    expect(getMinimumTierForFeature("smart_row_detection")).toBe("stitch_vision");
  });

  it("suggests upgrade target when feature is locked", () => {
    expect(getUpgradeTarget("free", "pdf_export")).toBe("stitch_plus");
    expect(getUpgradeTarget("stitch_plus", "camera_analysis")).toBe(
      "stitch_vision",
    );
    expect(getUpgradeTarget("stitch_vision", "pdf_export")).toBeNull();
  });

  it("compares tier rank correctly", () => {
    expect(isTierAtLeast("stitch_plus", "free")).toBe(true);
    expect(isTierAtLeast("free", "stitch_plus")).toBe(false);
    expect(isTierAtLeast("stitch_vision", "stitch_plus")).toBe(true);
  });
});
