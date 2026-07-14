import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "card" | "panel";
};

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
} as const;

export function Card({
  children,
  className,
  padding = "md",
  variant = "card",
}: CardProps) {
  return (
    <div
      className={cn(
        variant === "panel" ? "stitch-panel" : "stitch-card",
        paddingStyles[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-3", className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-base font-semibold text-stitch-ink", className)}>
      {children}
    </h3>
  );
}
