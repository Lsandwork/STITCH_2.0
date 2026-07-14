import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
};

export function AuthLayout({
  children,
  title,
  subtitle,
  className,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-stitch-cream px-4 py-10">
      <Link href="/" className="mb-8 flex flex-col items-center gap-3">
        <Image
          src={BRAND.mark}
          alt={BRAND.name}
          width={56}
          height={56}
          priority
        />
        <div className="text-center">
          <p className="text-lg font-semibold text-stitch-ink">{BRAND.name}</p>
          <p className="text-sm text-stitch-muted">{BRAND.tagline}</p>
        </div>
      </Link>

      <div
        className={cn(
          "stitch-panel w-full max-w-md p-6 sm:p-8",
          className,
        )}
      >
        <h1 className="text-xl font-bold text-stitch-ink">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-stitch-muted">{subtitle}</p>
        ) : null}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
