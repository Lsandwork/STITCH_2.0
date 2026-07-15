type MarketplacePatternStatsProps = {
  rating: number;
  downloads: number;
  reviews: number;
};

function formatStatValue(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "0";
  return value.toLocaleString();
}

export function MarketplacePatternStats({
  rating,
  downloads,
  reviews,
}: MarketplacePatternStatsProps) {
  const safeRating = Number.isFinite(rating) ? rating : 0;
  const safeDownloads = Number.isFinite(downloads) ? downloads : 0;
  const safeReviews = Number.isFinite(reviews) ? reviews : 0;

  return (
    <div
      className="mt-auto grid min-h-[72px] grid-cols-3 border-t border-stitch-border bg-stitch-cream/40"
      aria-label="Pattern statistics"
    >
      <div className="statItem flex flex-col items-center justify-center px-2 py-3 text-center">
        <div className="statValue text-sm font-semibold tabular-nums text-stitch-ink">
          {safeRating.toFixed(1)} ★
        </div>
        <div className="statLabel mt-1 text-[11px] text-stitch-muted">Rating</div>
      </div>

      <div
        className="statItem flex flex-col items-center justify-center border-x border-stitch-border/70 px-2 py-3 text-center"
      >
        <div className="statValue text-sm font-semibold tabular-nums text-stitch-ink">
          {formatStatValue(safeDownloads)}
        </div>
        <div className="statLabel mt-1 text-[11px] text-stitch-muted">Downloads</div>
      </div>

      <div className="statItem flex flex-col items-center justify-center px-2 py-3 text-center">
        <div className="statValue text-sm font-semibold tabular-nums text-stitch-ink">
          {formatStatValue(safeReviews)}
        </div>
        <div className="statLabel mt-1 text-[11px] text-stitch-muted">Reviews</div>
      </div>
    </div>
  );
}
