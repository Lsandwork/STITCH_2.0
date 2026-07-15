import { forwardRef, type ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const variantStyles = {
  primary:
    "bg-stitch-coral text-white hover:bg-stitch-coral-dark shadow-sm",
  olive:
    "bg-stitch-olive text-white hover:bg-stitch-olive-dark shadow-sm",
  secondary:
    "border border-stitch-border bg-stitch-paper text-stitch-ink hover:border-stitch-coral hover:text-stitch-coral",
  ghost:
    "bg-transparent text-stitch-ink hover:bg-stitch-peach hover:text-stitch-coral",
  soft:
    "bg-stitch-peach text-stitch-coral hover:bg-stitch-rose",
} as const;

const sizeStyles = {
  sm: "h-9 px-3.5 text-sm gap-1.5 rounded-stitch-sm",
  md: "h-11 px-5 text-sm gap-2 rounded-stitch-md",
  lg: "h-12 px-6 text-base gap-2 rounded-stitch-md",
  icon: "h-11 w-11 p-0 rounded-stitch-md",
} as const;

export type ButtonVariant = keyof typeof variantStyles;
export type ButtonSize = keyof typeof sizeStyles;

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<React.ComponentPropsWithoutRef<typeof Link>, "className"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  {
    variant = "primary",
    size = "md",
    className,
    children,
    ...props
  },
  ref,
) {
  const classes = cn(
    "inline-flex items-center justify-center font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...linkProps}
      >
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={buttonProps.type ?? "button"}
      className={classes}
      {...buttonProps}
    >
      {children}
    </button>
  );
});
