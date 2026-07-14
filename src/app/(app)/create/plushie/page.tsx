import { Suspense } from "react";
import { LoadingState } from "@/components/ui/LoadingState";
import PlushieBuilderClient from "./PlushieBuilderClient";

export default function PlushieBuilderPage() {
  return (
    <Suspense fallback={<LoadingState label="Loading builder…" />}>
      <PlushieBuilderClient />
    </Suspense>
  );
}
