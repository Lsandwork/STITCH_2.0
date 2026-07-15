import Link from "next/link";
import { StitchIcon } from "@/components/stitch/StitchIcon";

export function MarketplaceCTA() {
  return (
    <section className="mt-10 rounded-stitch-xl border border-stitch-border bg-gradient-to-r from-stitch-peach/50 to-stitch-cream p-6 shadow-stitch-card sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-stitch-border bg-stitch-paper shadow-stitch-card">
          <StitchIcon name="upload" tone="coral" size={22} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-stitch-ink">
            Share your creativity with the world
          </h2>
          <p className="mt-1 max-w-xl text-sm text-stitch-muted">
            Upload your pattern and reach thousands of makers.
          </p>
        </div>
      </div>

      <Link
        href="/marketplace/upload"
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-stitch-md bg-stitch-coral px-5 py-3 text-sm font-semibold text-white shadow-stitch-card transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stitch-coral sm:mt-0"
      >
        Become a designer
        <StitchIcon name="arrow-right" tone="default" size={16} className="brightness-0 invert" />
      </Link>
    </section>
  );
}
