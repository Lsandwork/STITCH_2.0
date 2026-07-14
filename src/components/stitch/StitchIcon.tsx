import Image from "next/image";
import { cn } from "@/lib/utils";
import { assetPath } from "@/lib/constants";

export type StitchIconTone = "default" | "coral" | "teal" | "gold" | "muted";

type StitchIconProps = {
  name: string;
  size?: number;
  tone?: StitchIconTone;
  className?: string;
  alt?: string;
};

const toneStyles: Record<StitchIconTone, string> = {
  default: "",
  coral:
    "[filter:brightness(0)_saturate(100%)_invert(58%)_sepia(28%)_saturate(1128%)_hue-rotate(318deg)_brightness(99%)_contrast(93%)]",
  teal: "[filter:brightness(0)_saturate(100%)_invert(48%)_sepia(18%)_saturate(1048%)_hue-rotate(131deg)_brightness(92%)_contrast(89%)]",
  gold: "[filter:brightness(0)_saturate(100%)_invert(68%)_sepia(48%)_saturate(620%)_hue-rotate(6deg)_brightness(95%)_contrast(92%)]",
  muted:
    "[filter:brightness(0)_saturate(100%)_invert(52%)_sepia(6%)_saturate(456%)_hue-rotate(349deg)_brightness(92%)_contrast(86%)]",
};

export function StitchIcon({
  name,
  size = 22,
  tone = "default",
  className,
  alt = "",
}: StitchIconProps) {
  return (
    <Image
      src={assetPath.icon(name)}
      alt={alt}
      width={size}
      height={size}
      className={cn("shrink-0", toneStyles[tone], className)}
    />
  );
}
