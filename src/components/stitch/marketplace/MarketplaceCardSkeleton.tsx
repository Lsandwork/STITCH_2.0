export function MarketplaceCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-stitch-lg border border-stitch-border bg-stitch-paper shadow-stitch-card">
      <div className="aspect-[4/3] animate-pulse bg-stitch-cream" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-24 animate-pulse rounded bg-stitch-cream" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-stitch-cream" />
        <div className="h-4 w-full animate-pulse rounded bg-stitch-cream" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-stitch-cream" />
        <div className="h-6 w-20 animate-pulse rounded-stitch-pill bg-stitch-cream" />
      </div>
      <div className="grid grid-cols-3 border-t border-stitch-border bg-stitch-cream/40 py-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-2 px-2">
            <div className="h-4 w-12 animate-pulse rounded bg-stitch-cream" />
            <div className="h-3 w-14 animate-pulse rounded bg-stitch-cream" />
          </div>
        ))}
      </div>
    </article>
  );
}
