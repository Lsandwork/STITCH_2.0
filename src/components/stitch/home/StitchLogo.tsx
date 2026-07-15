import Image from "next/image";
import Link from "next/link";
import { assetPath } from "@/lib/constants";
import { cn } from "@/lib/utils";

type StitchLogoProps = {
  variant?: "dark" | "olive";
  showWordmark?: boolean;
  className?: string;
};

export function StitchLogo({
  variant = "dark",
  showWordmark = true,
  className,
}: StitchLogoProps) {
  const markSrc =
    variant === "olive"
      ? assetPath.brand("stitch-mark")
      : assetPath.brand("stitch-mark");

  return (
    <Link href="/dashboard" className={cn("flex items-center gap-2.5", className)}>
      <Image
        src={markSrc}
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 shrink-0"
        priority
      />
      {showWordmark ? (
        <span
          className={cn(
            "font-serif text-2xl font-semibold tracking-tight",
            variant === "olive" ? "text-stitch-olive" : "text-stitch-ink",
          )}
        >
          Stitch
        </span>
      ) : null}
    </Link>
  );
}
