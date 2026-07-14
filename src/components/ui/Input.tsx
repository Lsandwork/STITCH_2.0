import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    leadingIcon,
    trailingIcon,
    className,
    id,
    ...props
  },
  ref,
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="block w-full">
      {label ? (
        <span className="mb-1.5 block text-sm font-medium text-stitch-ink">
          {label}
        </span>
      ) : null}
      <div className="relative">
        {leadingIcon ? (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stitch-muted">
            {leadingIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-stitch-pill border border-stitch-border bg-stitch-paper px-4 py-2.5 text-sm text-stitch-ink placeholder:text-stitch-muted transition-colors",
            "hover:border-stitch-coral/40 focus:border-stitch-teal focus:outline-none focus:ring-2 focus:ring-stitch-teal/20",
            leadingIcon && "pl-10",
            trailingIcon && "pr-10",
            error && "border-red-400 focus:border-red-400 focus:ring-red-200",
            className,
          )}
          {...props}
        />
        {trailingIcon ? (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stitch-muted">
            {trailingIcon}
          </span>
        ) : null}
      </div>
      {error ? (
        <span className="mt-1.5 block text-xs text-red-500">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-stitch-muted">{hint}</span>
      ) : null}
    </label>
  );
});
