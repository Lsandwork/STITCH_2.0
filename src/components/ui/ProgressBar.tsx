import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  className?: string;
  barClassName?: string;
  size?: "sm" | "md";
  label?: string;
};

export function ProgressBar({
  value,
  className,
  barClassName,
  size = "md",
  label,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="mb-1.5 flex items-center justify-between text-xs text-stitch-muted">
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
      ) : null}
      <div
        className={cn(
          "stitch-progress",
          size === "sm" && "h-1.5",
          size === "md" && "h-2",
        )}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span
          className={cn("stitch-progress-bar", barClassName)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
