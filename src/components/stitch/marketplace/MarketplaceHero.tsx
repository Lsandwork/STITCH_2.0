import Image from "next/image";
import Link from "next/link";
import { yarnImage } from "@/lib/project-images";
import { StitchIcon } from "@/components/stitch/StitchIcon";

export function MarketplaceHero() {
  return (
    <section className="relative overflow-hidden rounded-stitch-xl border border-stitch-border bg-gradient-to-br from-stitch-peach/70 via-stitch-cream to-stitch-mint/30 p-6 shadow-stitch-card sm:p-8 lg:p-10">
      <Link
        href="/marketplace/upload"
        className="mb-5 inline-flex w-full items-center justify-center gap-2 rounded-stitch-md bg-stitch-coral px-4 py-2.5 text-sm font-semibold text-white shadow-stitch-card transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stitch-coral sm:mb-0 sm:w-auto lg:absolute lg:right-8 lg:top-8"
      >
        <StitchIcon name="upload" tone="default" size={18} className="brightness-0 invert" />
        Upload pattern
      </Link>

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="max-w-2xl">
          <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-stitch-coral">
            <StitchIcon name="sparkles" tone="coral" size={16} />
            AI Crochet Marketplace
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-stitch-ink sm:text-4xl">
            Marketplace
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-stitch-muted sm:text-base">
            Discover beautiful patterns from talented designers. Upload your own and
            share your creativity with the world.
          </p>
        </div>

        <div className="relative hidden min-h-[180px] overflow-hidden rounded-stitch-lg lg:block">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-stitch-cream/20 to-stitch-peach/80" />
          <Image
            src={yarnImage.skeins}
            alt=""
            fill
            sizes="(max-width: 1024px) 0vw, 360px"
            className="object-cover object-center opacity-90"
            priority
          />
        </div>
      </div>
    </section>
  );
}
