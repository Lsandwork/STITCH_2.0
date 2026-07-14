import Link from "next/link";
import { QUICK_ACTIONS } from "@/lib/constants";
import { StitchIcon } from "@/components/stitch/StitchIcon";

type QuickActionsPanelProps = {
  title?: string;
  compact?: boolean;
};

export function QuickActionsPanel({
  title = "Quick Actions",
  compact = false,
}: QuickActionsPanelProps) {
  return (
    <section className={compact ? "h-full" : undefined}>
      <h2 className="mb-4 text-lg font-semibold text-stitch-ink">{title}</h2>
      <div
        className={
          compact
            ? "grid h-[calc(100%-2.5rem)] grid-cols-2 gap-3"
            : "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
        }
      >
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="stitch-quick-action text-center"
          >
            <StitchIcon name={action.icon} tone="coral" size={compact ? 26 : 30} />
            <span className="text-xs font-medium leading-tight text-stitch-ink">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
