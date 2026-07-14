import { cn } from "@/lib/utils";

type LoadingStateProps = {
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeStyles = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
} as const;

export function LoadingState({
  label = "Loading...",
  className,
  size = "md",
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-10 text-stitch-muted",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span
        className={cn(
          "animate-spin rounded-full border-stitch-border border-t-stitch-teal",
          sizeStyles[size],
        )}
        aria-hidden
      />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function LoadingSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-stitch-md bg-stitch-sand/70",
        className,
      )}
      aria-hidden
    />
  );
}
