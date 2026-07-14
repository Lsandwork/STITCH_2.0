import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { StitchIcon } from "@/components/stitch/StitchIcon";

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-stitch-cream px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stitch-peach">
        <StitchIcon name="warning" tone="gold" size={32} />
      </div>
      <h1 className="text-2xl font-bold text-stitch-ink">You&apos;re offline</h1>
      <p className="mt-2 max-w-md text-sm text-stitch-muted">
        {BRAND.name} saved your recent projects locally. Reconnect to sync
        progress and use AI features.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button href="/">Open dashboard</Button>
        <Button href="/projects" variant="secondary">
          My projects
        </Button>
      </div>
      <Link
        href="/workspace/demo-dachshund"
        className="mt-4 text-sm font-medium text-stitch-coral hover:underline"
      >
        Continue Dachshund Plushie offline
      </Link>
    </div>
  );
}
