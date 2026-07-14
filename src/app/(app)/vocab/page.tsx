import { Suspense } from "react";
import { LoadingState } from "@/components/ui/LoadingState";
import { VocabClient } from "@/components/stitch/vocab/VocabClient";

export default function VocabPage() {
  return (
    <Suspense fallback={<LoadingState label="Loading vocabulary…" />}>
      <VocabClient />
    </Suspense>
  );
}
