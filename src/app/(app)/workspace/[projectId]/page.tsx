import { Suspense } from "react";
import { LoadingState } from "@/components/ui/LoadingState";
import WorkspaceClient from "./WorkspaceClient";

export default function WorkspacePage() {
  return (
    <Suspense fallback={<LoadingState label="Loading workspace…" />}>
      <WorkspaceClient />
    </Suspense>
  );
}
