import type { SubscriptionTier as TierId } from "@/types/database";

export const BILLING_PROMO = {
  title: "2026 Founder Rate — Lock In for Life",
  headline: "Subscribe before Dec 31, 2026 and keep this price forever.",
  description:
    "As a startup launch offer for new members, subscribe monthly through the end of 2026 or pay annually now. Keep your Stitch Plus or Stitch Vision rate for life — even when standard pricing begins in January 2027.",
  lockInNote:
    "Lifetime rate lock applies while your subscription stays active. Cancel and resubscribe later at standard rates.",
  validThrough: "2026-12-31",
  standardPricingStarts: "January 2027",
} as const;

export type BillingPlan = {
  tierId: TierId;
  name: string;
  monthlyPriceCents: number;
  annualPriceCents: number;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export const BILLING_PLANS: BillingPlan[] = [
  {
    tierId: "free",
    name: "Free",
    monthlyPriceCents: 0,
    annualPriceCents: 0,
    description: "Essential crochet tools to get started.",
    features: [
      "Up to 3 active projects",
      "Basic manual row counter",
      "3 pattern uploads",
      "10 Tutor messages per month",
      "Manual Yarn Vault",
    ],
  },
  {
    tierId: "stitch_plus",
    name: "Stitch Plus",
    monthlyPriceCents: 499,
    annualPriceCents: 4990,
    description: "AI-powered pattern tools and unlimited projects.",
    features: [
      "Unlimited projects",
      "AI pattern generation",
      "Pattern translation",
      "Voice pattern player",
      "Yarn substitutions",
      "Color Studio",
      "PDF export",
    ],
    highlighted: true,
  },
  {
    tierId: "stitch_vision",
    name: "Stitch Vision",
    monthlyPriceCents: 999,
    annualPriceCents: 9990,
    description: "Everything in Plus with camera intelligence.",
    features: [
      "Everything in Stitch Plus",
      "Camera stitch analysis",
      "Smart row detection",
      "Mistake detection",
      "Photo-to-pattern",
      "Advanced scan history",
    ],
  },
];

export function formatUsd(cents: number): string {
  if (cents === 0) return "$0";
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatMonthlyPrice(cents: number): string {
  if (cents === 0) return "$0";
  return `${formatUsd(cents)}/mo`;
}

export function formatAnnualPrice(cents: number): string {
  if (cents === 0) return "$0";
  return `${formatUsd(cents)}/yr`;
}

export function getBillingPlan(tierId: TierId): BillingPlan {
  const plan = BILLING_PLANS.find((item) => item.tierId === tierId);
  if (!plan) {
    throw new Error(`Unknown billing plan: ${tierId}`);
  }
  return plan;
}

export function getAnnualSavingsCents(plan: BillingPlan): number {
  if (plan.monthlyPriceCents === 0) return 0;
  return plan.monthlyPriceCents * 12 - plan.annualPriceCents;
}
