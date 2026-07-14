"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { StitchIcon } from "@/components/stitch/StitchIcon";

export function OfflineIndicator() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);

    function handleOnline() {
      setOnline(true);
    }

    function handleOffline() {
      setOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div
      role="status"
      className={cn(
        "fixed left-1/2 top-3 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-stitch-pill border border-stitch-border bg-stitch-paper px-4 py-2 text-sm font-medium text-stitch-ink shadow-stitch-card",
        "md:left-[calc(var(--stitch-sidebar-width)+1rem)] md:translate-x-0",
      )}
    >
      <StitchIcon name="warning" tone="gold" size={18} />
      <span>You&apos;re offline. Changes will sync when reconnected.</span>
    </div>
  );
}
