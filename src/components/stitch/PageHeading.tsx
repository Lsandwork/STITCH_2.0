import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

type PageHeadingProps = {
  title: string;
  description?: string;
  backHref?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
};

export function PageHeading({
  title,
  description,
  backHref,
  actionLabel,
  actionHref,
  className,
}: PageHeadingProps) {
  return (
    <div className={cn("mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="min-w-0 pt-12 md:pt-0">
        {backHref ? (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-stitch-coral hover:underline"
          >
            ← Back
          </Link>
        ) : null}
        <h1 className="text-2xl font-bold tracking-tight text-stitch-ink">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-stitch-muted">{description}</p>
        ) : null}
      </div>
      {actionLabel && actionHref ? (
        <Button href={actionHref} className="shrink-0">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
