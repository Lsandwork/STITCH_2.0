import Link from "next/link";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { Button } from "@/components/ui/Button";
import {
  FEATURE_SHORTCUTS,
  MY_COLLECTIONS_LINKS,
  QUICK_CREATE_LINKS,
} from "@/lib/home-navigation";
import { yarnImage } from "@/lib/project-images";

export function FeatureShortcutRow() {
  return (
    <section
      aria-label="Feature shortcuts"
      className="border-b border-stitch-border bg-stitch-paper"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px bg-stitch-border sm:grid-cols-3 lg:grid-cols-5">
        {FEATURE_SHORTCUTS.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            className="flex flex-col gap-1 bg-stitch-paper px-4 py-4 transition-colors hover:bg-stitch-warm-white sm:px-5 sm:py-5"
          >
            <StitchIcon name={item.icon} tone="muted" size={20} />
            <span className="text-sm font-semibold text-stitch-ink">
              {item.label}
            </span>
            <span className="text-xs text-stitch-muted">{item.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

type HomeLeftSidebarProps = {
  showUpgrade?: boolean;
};

export function HomeLeftSidebar({ showUpgrade = true }: HomeLeftSidebarProps) {
  return (
    <aside className="space-y-8">
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stitch-muted">
          Quick Create
        </h2>
        <ul className="space-y-1">
          {QUICK_CREATE_LINKS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center gap-2.5 rounded-stitch-sm px-2 py-2 text-sm text-stitch-ink transition-colors hover:bg-stitch-paper hover:text-stitch-olive"
              >
                <StitchIcon name={item.icon} tone="muted" size={18} />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stitch-muted">
          My Collections
        </h2>
        <ul className="space-y-1">
          {MY_COLLECTIONS_LINKS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center gap-2.5 rounded-stitch-sm px-2 py-2 text-sm text-stitch-ink transition-colors hover:bg-stitch-paper hover:text-stitch-olive"
              >
                <StitchIcon name={item.icon} tone="muted" size={18} />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {showUpgrade ? (
        <div className="overflow-hidden rounded-stitch-lg border border-stitch-border bg-gradient-to-br from-stitch-blush/40 to-stitch-rose/30">
          <div
            className="h-24 bg-cover bg-center"
            style={{ backgroundImage: `url(${yarnImage.coral})` }}
            role="img"
            aria-label="Pink yarn texture"
          />
          <div className="p-4">
            <h3 className="font-serif text-lg font-semibold text-stitch-ink">
              Upgrade to Pro
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-stitch-muted">
              Unlock unlimited patterns, advanced tools, and more.
            </p>
            <Button
              href="/settings/subscription"
              variant="olive"
              size="sm"
              className="mt-3 w-full"
            >
              Go Pro
            </Button>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
