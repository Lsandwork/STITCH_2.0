import { cn } from "@/lib/utils";

const variantStyles = {
  default: "bg-stitch-sand text-stitch-ink",
  coral: "bg-stitch-rose text-stitch-coral",
  teal: "bg-stitch-mint text-stitch-teal",
  gold: "bg-amber-50 text-stitch-gold",
  lavender: "bg-purple-50 text-stitch-lavender",
  success: "bg-emerald-50 text-emerald-700",
} as const;

type BadgeProps = {
  children: React.ReactNode;
  variant?: keyof typeof variantStyles;
  className?: string;
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-stitch-pill px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
