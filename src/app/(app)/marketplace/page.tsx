import { Suspense } from "react";
import { MarketplaceClient } from "@/components/stitch/marketplace/MarketplaceClient";
import { LoadingState } from "@/components/ui/LoadingState";

export default function MarketplacePage() {
  return (
    <Suspense fallback={<LoadingState label="Loading marketplace…" />}>
      <MarketplaceClient />
    </Suspense>
  );
}
