"use client";

import { useEffect } from "react";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV === "development"
    ) {
      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .catch((error) => {
        console.warn("[sw] registration failed", error);
      });
  }, []);

  return <>{children}</>;
}
