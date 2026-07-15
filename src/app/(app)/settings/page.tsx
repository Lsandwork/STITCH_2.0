import Link from "next/link";
import Image from "next/image";
import { PageHeading } from "@/components/stitch/PageHeading";
import { QuickNavigationGrid } from "@/components/stitch/QuickNavigationGrid";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getServerAppUser } from "@/lib/app-user";
import { getBillingPlan } from "@/lib/billing";

const SETTINGS_LINKS = [
  {
    label: "Profile",
    href: "/settings/profile",
    icon: "user" as const,
    description: "Photo, display name, email, and password",
  },
  {
    label: "Accessibility",
    href: "/settings/accessibility",
    icon: "settings" as const,
    description: "Manage display, voice and accessibility options",
  },
  {
    label: "Subscription",
    href: "/settings/subscription",
    icon: "star" as const,
    description: "View your plan, billing and upgrade options",
  },
];

function formatTierLabel(tier: string, lifetimeAccess: boolean) {
  const name = getBillingPlan(tier as "free" | "stitch_plus" | "stitch_vision").name;
  if (lifetimeAccess) return `${name} · Lifetime`;
  return name;
}

export default async function SettingsPage() {
  const user = await getServerAppUser();
  const displayName = user?.displayName ?? "Maker";
  const email = user?.email ?? "";
  const avatarUrl = user?.avatarUrl ?? "/assets/stitch/avatars/svg/avatar-1.svg";
  const tierLabel = user ? formatTierLabel(user.subscriptionTier, user.lifetimeAccess) : "Free";
  const settingsLinks = [
    ...SETTINGS_LINKS.map((link) =>
      link.label === "Subscription" && user?.lifetimeAccess
        ? {
            ...link,
            description: "View your lifetime access and included features",
          }
        : link,
    ),
    ...(user?.adminRole === "admin"
      ? [
          {
            label: "Users",
            href: "/admin/users",
            icon: "users" as const,
            description: "Manage accounts, access, and user activity",
          },
        ]
      : []),
  ];

  return (
    <>
      <PageHeading
        title="Profile & Settings"
        description="Manage your Stitch account and preferences."
      />

      <div className="mb-6 overflow-hidden rounded-stitch-lg border border-stitch-border bg-stitch-paper shadow-stitch-card">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <Image
              src={avatarUrl}
              alt={displayName}
              width={72}
              height={72}
              className="h-[72px] w-[72px] rounded-full border-2 border-stitch-border object-cover"
            />
            <Link
              href="/settings/profile"
              className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-stitch-border bg-stitch-paper shadow-stitch-card"
              aria-label="Edit profile photo"
            >
              <StitchIcon name="edit" tone="muted" size={14} />
            </Link>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-stitch-ink">{displayName}</h2>
              {user?.adminRole === "admin" ? (
                <Badge variant="gold">Admin</Badge>
              ) : null}
              <Badge variant={user?.lifetimeAccess ? "teal" : "default"}>{tierLabel}</Badge>
            </div>
            <p className="mt-0.5 text-sm text-stitch-muted">{email}</p>
          </div>

          <Button href="/settings/profile" variant="secondary" size="sm" className="shrink-0">
            <StitchIcon name="edit" tone="coral" size={16} className="mr-1.5" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="mb-8 grid gap-3">
        {settingsLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-4 rounded-stitch-lg border border-stitch-border bg-stitch-paper p-4 shadow-stitch-card transition-colors hover:bg-stitch-cream/50"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-stitch-md bg-stitch-peach">
              <StitchIcon name={link.icon} tone="coral" size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-stitch-ink">{link.label}</p>
              <p className="text-sm text-stitch-muted">{link.description}</p>
            </div>
            <StitchIcon name="chevron-right" tone="muted" size={20} className="shrink-0" />
          </Link>
        ))}
      </div>

      <QuickNavigationGrid viewAllHref="/dashboard" />
    </>
  );
}
