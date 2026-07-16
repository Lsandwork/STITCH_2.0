"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HomePattern } from "@/lib/home-patterns";
import { StitchIcon } from "@/components/stitch/StitchIcon";

type PatternCardProps = {
  pattern: HomePattern;
};

export function PatternCard({ pattern }: PatternCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="group">
      <Link href={pattern.href} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-stitch-md bg-stitch-paper">
          <Image
            src={pattern.imageUrl}
            alt={pattern.imageAlt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 180px"
          />
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              setSaved((value) => !value);
            }}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-stitch-paper/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-stitch-paper"
            aria-label={saved ? "Remove from saved" : "Save pattern"}
          >
            <StitchIcon
              name="heart"
              tone={saved ? "coral" : "muted"}
              size={16}
            />
          </button>
          {pattern.featured ? (
            <span className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-stitch-paper/90 shadow-sm backdrop-blur-sm">
              <StitchIcon name="bookmark" tone="muted" size={14} />
            </span>
          ) : null}
        </div>
        <div className="mt-2.5">
          <h3 className="text-sm font-semibold leading-snug text-stitch-ink group-hover:text-stitch-olive">
            {pattern.title}
          </h3>
          <p className="mt-0.5 text-xs text-stitch-muted">by {pattern.author}</p>
        </div>
      </Link>
    </article>
  );
}

type PatternGridSectionProps = {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  patterns: HomePattern[];
  seeAllHref?: string;
};

export function PatternGridSection({
  id,
  title,
  subtitle,
  icon,
  patterns,
  seeAllHref = "/learn",
}: PatternGridSectionProps) {
  return (
    <section aria-labelledby={id} className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <StitchIcon name={icon} tone="muted" size={18} />
            <h2
              id={id}
              className="font-serif text-xl font-semibold text-stitch-ink sm:text-2xl"
            >
              {title}
            </h2>
          </div>
          {subtitle ? (
            <p className="mt-1 text-sm text-stitch-muted">{subtitle}</p>
          ) : null}
        </div>
        <Link
          href={seeAllHref}
          className="shrink-0 text-sm font-medium text-stitch-olive hover:underline"
        >
          See all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-6">
        {patterns.map((pattern) => (
          <PatternCard key={pattern.id} pattern={pattern} />
        ))}
      </div>
    </section>
  );
}
