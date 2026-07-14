import { Suspense } from "react";
import { LoadingState } from "@/components/ui/LoadingState";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingState label="Loading…" className="min-h-dvh" />}>
      <LoginForm />
    </Suspense>
  );
}
