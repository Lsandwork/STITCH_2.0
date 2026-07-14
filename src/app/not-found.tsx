"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { StitchIcon } from "@/components/stitch/StitchIcon";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = `Page not found · ${BRAND.name}`;
  }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-stitch-cream px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stitch-peach">
        <StitchIcon name="error" tone="coral" size={32} />
      </div>
      <h1 className="text-2xl font-bold text-stitch-ink">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-stitch-muted">
        We couldn&apos;t find that stitch in the pattern. It may have been moved
        or frogged entirely.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button href="/">Back to dashboard</Button>
        <Button href="/create" variant="secondary">
          Create Studio
        </Button>
      </div>
      <Link
        href="/tutor"
        className="mt-4 text-sm font-medium text-stitch-coral hover:underline"
      >
        Ask the Tutor for help
      </Link>
    </div>
  );
}
