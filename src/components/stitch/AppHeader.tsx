"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn, getTimeOfDayGreeting } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { SearchOverlay } from "@/components/stitch/SearchOverlay";

type AppHeaderProps = {
  displayName: string;
  subtitle?: string;
  avatarUrl: string;
  unreadNotifications?: number;
  className?: string;
};

export function AppHeader({
  displayName,
  subtitle = "Ready to create something beautiful today?",
  avatarUrl,
  unreadNotifications = 0,
  className,
}: AppHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const greeting = getTimeOfDayGreeting();

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header
        className={cn(
          "mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
          className,
        )}
      >
        <div className="min-w-0 pt-12 md:pt-0">
          <h1 className="text-2xl font-bold tracking-tight text-stitch-ink">
            {greeting}, {displayName}!{" "}
            <span aria-hidden className="inline-block">
              👋
            </span>
          </h1>
          <p className="mt-1 text-sm text-stitch-muted">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3 lg:min-w-[320px] lg:flex-1 lg:justify-end">
          <div className="hidden flex-1 lg:block lg:max-w-md">
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onFocus={openSearch}
              placeholder="Search projects, patterns, lessons..."
              leadingIcon={<StitchIcon name="search" tone="muted" size={18} />}
              aria-label="Search"
            />
          </div>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-stitch-pill border border-stitch-border bg-stitch-paper lg:hidden"
            onClick={openSearch}
            aria-label="Open search"
          >
            <StitchIcon name="search" tone="muted" />
          </button>

          <Link
            href="/notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-stitch-pill border border-stitch-border bg-stitch-paper transition-colors hover:border-stitch-coral"
            aria-label={
              unreadNotifications > 0
                ? `${unreadNotifications} unread notifications`
                : "Notifications"
            }
          >
            <StitchIcon name="bell" tone="muted" />
            {unreadNotifications > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-stitch-coral px-1 text-[10px] font-semibold text-white">
                {unreadNotifications > 9 ? "9+" : unreadNotifications}
              </span>
            ) : null}
          </Link>

          <Link
            href="/settings"
            className="overflow-hidden rounded-full border-2 border-stitch-border transition-colors hover:border-stitch-coral"
            aria-label="Profile and settings"
          >
            <Image
              src={avatarUrl}
              alt={`${displayName}'s avatar`}
              width={44}
              height={44}
              className="h-11 w-11 object-cover"
            />
          </Link>
        </div>
      </header>

      <SearchOverlay
        open={searchOpen}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onClose={closeSearch}
      />
    </>
  );
}
