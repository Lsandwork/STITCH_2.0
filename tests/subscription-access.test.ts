import { describe, expect, it } from "vitest";
import {
  resolveFeatureTier,
  shouldShowUpgradePrompts,
} from "@/lib/subscription-access";

describe("subscription access helpers", () => {
  it("uses assigned tier when lifetime access has a paid tier", () => {
    expect(
      resolveFeatureTier({
        subscriptionTier: "stitch_vision",
        lifetimeAccess: true,
      }),
    ).toBe("stitch_vision");
  });

  it("upgrades free lifetime users to stitch vision", () => {
    expect(
      resolveFeatureTier({
        subscriptionTier: "free",
        lifetimeAccess: true,
      }),
    ).toBe("stitch_vision");
  });

  it("hides upgrade prompts for lifetime users", () => {
    expect(
      shouldShowUpgradePrompts({
        subscriptionTier: "free",
        lifetimeAccess: true,
      }),
    ).toBe(false);
  });

  it("shows upgrade prompts for free users without lifetime access", () => {
    expect(
      shouldShowUpgradePrompts({
        subscriptionTier: "free",
        lifetimeAccess: false,
      }),
    ).toBe(true);
  });

  it("hides upgrade prompts for stitch vision subscribers", () => {
    expect(
      shouldShowUpgradePrompts({
        subscriptionTier: "stitch_vision",
        lifetimeAccess: false,
      }),
    ).toBe(false);
  });
});
