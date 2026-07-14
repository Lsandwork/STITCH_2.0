import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-stitch-lg border border-dashed border-stitch-border bg-stitch-paper px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-stitch-peach text-stitch-coral">
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-semibold text-stitch-ink">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm text-stitch-muted">{description}</p>
      ) : null}
      {actionLabel ? (
        <div className="mt-5">
          {actionHref ? (
            <Button href={actionHref} size="sm">
              {actionLabel}
            </Button>
          ) : (
            <Button size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
