import { MarketplaceDetailClient } from "@/components/stitch/marketplace/MarketplaceDetailClient";

type PageProps = {
  params: Promise<{ listingId: string }>;
};

export default async function MarketplaceDetailPage({ params }: PageProps) {
  const { listingId } = await params;
  return <MarketplaceDetailClient listingId={listingId} />;
}
