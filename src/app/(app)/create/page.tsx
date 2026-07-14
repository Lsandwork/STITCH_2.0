import Image from "next/image";
import Link from "next/link";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Card } from "@/components/ui/Card";
import { projectImage } from "@/lib/project-images";
import { StitchIcon } from "@/components/stitch/StitchIcon";

const CREATE_OPTIONS = [
  {
    title: "AI Pattern Generator",
    description: "Describe your dream project and get a full written pattern.",
    href: "/create/pattern",
    icon: "sparkles" as const,
    image: projectImage.patternFromPhoto,
  },
  {
    title: "From a Photo",
    description: "Upload a photo and reconstruct an approximate crochet pattern.",
    href: "/create/photo",
    icon: "image" as const,
    image: projectImage.patternFromPhoto,
  },
  {
    title: "Plushie Builder",
    description: "Pick shapes, colors, and features for a custom amigurumi.",
    href: "/create/plushie",
    icon: "create" as const,
    image: projectImage.plushieBuilder,
  },
  {
    title: "Color Studio",
    description: "Build palettes from mood, stash colors, or inspiration photos.",
    href: "/create/colors",
    icon: "palette" as const,
    image: projectImage.colorStudio,
  },
];

export default function CreateHubPage() {
  return (
    <>
      <PageHeading
        title="Create Studio"
        description="Generate patterns, palettes, and plushie designs with AI."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {CREATE_OPTIONS.map((option) => (
          <Link key={option.href} href={option.href}>
            <Card className="group h-full transition-transform hover:-translate-y-0.5">
              <div className="flex gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-stitch-md bg-stitch-cream">
                  <Image
                    src={option.image}
                    alt={option.title}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold text-stitch-ink">{option.title}</h2>
                    <StitchIcon name={option.icon} tone="coral" size={22} />
                  </div>
                  <p className="mt-1 text-sm text-stitch-muted">{option.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
