import { HomeDashboard } from "@/components/stitch/home/HomeDashboard";
import { HomeShell } from "@/components/stitch/home/HomeShell";
import { getServerAppUser } from "@/lib/app-user";
import { shouldShowUpgradePrompts } from "@/lib/subscription-access";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Create more. Stitch together. Crochet, knit, embroider, and more — smart tools, beautiful patterns, and a community that inspires.",
};

export default async function DashboardPage() {
  const user = await getServerAppUser();
  const displayName = user?.displayName ?? "Creator";
  const avatarUrl =
    user?.avatarUrl ?? "/assets/stitch/avatars/svg/avatar-1.svg";
  const showUpgrade = user
    ? shouldShowUpgradePrompts({
        subscriptionTier: user.subscriptionTier,
        lifetimeAccess: user.lifetimeAccess,
      })
    : true;

  return (
    <HomeShell avatarUrl={avatarUrl} displayName={displayName}>
      <HomeDashboard
        displayName={displayName}
        showUpgrade={showUpgrade}
      />
    </HomeShell>
  );
}
