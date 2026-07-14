import { describe, expect, it } from "vitest";
import {
  BILLING_PLANS,
  BILLING_PROMO,
  formatMonthlyPrice,
  getAnnualSavingsCents,
  getBillingPlan,
} from "@/lib/billing";
import { SUBSCRIPTION_TIERS } from "@/lib/constants";

describe("billing plans", () => {
  it("prices Stitch Plus at $4.99/mo", () => {
    const plan = getBillingPlan("stitch_plus");
    expect(plan.monthlyPriceCents).toBe(499);
    expect(formatMonthlyPrice(plan.monthlyPriceCents)).toBe("$4.99/mo");
  });

  it("prices Stitch Vision at $9.99/mo", () => {
    const plan = getBillingPlan("stitch_vision");
    expect(plan.monthlyPriceCents).toBe(999);
    expect(formatMonthlyPrice(plan.monthlyPriceCents)).toBe("$9.99/mo");
  });

  it("offers annual billing with savings", () => {
    const plus = getBillingPlan("stitch_plus");
    const vision = getBillingPlan("stitch_vision");
    expect(getAnnualSavingsCents(plus)).toBe(998);
    expect(getAnnualSavingsCents(vision)).toBe(1998);
  });

  it("exposes founder promo through end of 2026", () => {
    expect(BILLING_PROMO.validThrough).toBe("2026-12-31");
    expect(BILLING_PROMO.standardPricingStarts).toBe("January 2027");
  });

  it("maps subscription tiers from billing plans", () => {
    expect(SUBSCRIPTION_TIERS).toHaveLength(BILLING_PLANS.length);
    expect(SUBSCRIPTION_TIERS.find((tier) => tier.id === "stitch_plus")?.price).toBe(
      "$4.99/mo",
    );
    expect(SUBSCRIPTION_TIERS.find((tier) => tier.id === "stitch_vision")?.price).toBe(
      "$9.99/mo",
    );
  });
});
