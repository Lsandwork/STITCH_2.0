import Link from "next/link";
import Image from "next/image";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Card } from "@/components/ui/Card";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { DEMO_USER } from "@/lib/demo-data";
import { NAV_ITEMS } from "@/lib/constants";

const SETTINGS_LINKS = [
  { label: "Profile", href: "/settings/profile", icon: "user" as const },
  { label: "Accessibility", href: "/settings/accessibility", icon: "settings" as const },
  { label: "Subscription", href: "/settings/subscription", icon: "star" as const },
];

export default function SettingsPage() {
  return (
    <>
      <PageHeading title="Profile & Settings" description="Manage your Stitch account and preferences." />

      <Card padding="lg" className="mb-6 max-w-xl">
        <div className="flex items-center gap-4">
          <Image
            src={DEMO_USER.avatarUrl}
            alt={DEMO_USER.displayName}
            width={64}
            height={64}
            className="h-16 w-16 rounded-full border-2 border-stitch-border object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold">{DEMO_USER.displayName}</h2>
            <p className="text-sm text-stitch-muted">{DEMO_USER.email}</p>
            <p className="mt-1 text-xs font-medium capitalize text-stitch-coral">
              {DEMO_USER.subscriptionTier.replace("_", " ")}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid max-w-xl gap-3">
        {SETTINGS_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="stitch-card flex items-center gap-3 p-4 transition-colors hover:bg-stitch-cream"
          >
            <StitchIcon name={link.icon} tone="coral" size={22} />
            <span className="font-medium">{link.label}</span>
            <StitchIcon name="chevron-right" tone="muted" size={18} className="ml-auto" />
          </Link>
        ))}
      </div>

      <Card className="mt-8 max-w-xl">
        <h3 className="mb-3 text-sm font-semibold text-stitch-muted">Quick navigation</h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {NAV_ITEMS.slice(1, 7).map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-sm text-stitch-coral hover:underline">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
