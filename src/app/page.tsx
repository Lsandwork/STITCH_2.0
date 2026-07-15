import type { Metadata } from "next";
import { LandingPage } from "@/components/marketing/LandingPage";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${BRAND.name} — Stitch Your Itch`,
  description:
    "Sign up free. Design AI patterns, track rows, scan your stitches, and get crochet help — all in one beautiful app.",
  openGraph: {
    title: "Stitch Your Itch — Free crochet companion",
    description: BRAND.secondaryTagline,
  },
};

export default function MarketingHomePage() {
  return <LandingPage />;
}
