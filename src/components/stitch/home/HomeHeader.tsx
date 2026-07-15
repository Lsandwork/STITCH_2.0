"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StitchLogo } from "@/components/stitch/home/StitchLogo";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { SearchOverlay } from "@/components/stitch/SearchOverlay";
import { HOME_NAV_ITEMS } from "@/lib/home-navigation";
import { cn } from "@/lib/utils";

type HomeHeaderProps = {
  avatarUrl: string;
  displayName: string;
};

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function HomeHeader({ avatarUrl, displayName }: HomeHeaderProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
      <header className="sticky top-0 z-50 border-b border-stitch-border bg-stitch-warm-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <StitchLogo />

          <nav
            className="hidden items-center gap-7 lg:flex"
            aria-label="Main navigation"
          >
            {HOME_NAV_ITEMS.map((item) => {
              const active = isNavActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative py-1 text-sm font-medium transition-colors",
                    active
                      ? "text-stitch-ink after:absolute after:inset-x-0 after:-bottom-[21px] after:h-0.5 after:bg-stitch-ink"
                      : "text-stitch-muted hover:text-stitch-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="hidden min-w-0 md:block md:w-[220px] lg:w-[280px]">
              <button
                type="button"
                onClick={openSearch}
                className="flex h-10 w-full items-center gap-2 rounded-stitch-pill border border-stitch-border bg-stitch-paper px-4 text-left text-sm text-stitch-muted transition-colors hover:border-stitch-olive/40"
                aria-label="Search patterns, yarns, tools"
              >
                <StitchIcon name="search" tone="muted" size={16} />
                <span className="truncate">Search patterns, yarns, tools…</span>
              </button>
            </div>

            <button
              type="button"
              onClick={openSearch}
              className="flex h-10 w-10 items-center justify-center rounded-stitch-pill border border-stitch-border bg-stitch-paper md:hidden"
              aria-label="Search"
            >
              <StitchIcon name="search" tone="muted" size={18} />
            </button>

            <Link
              href="/patterns"
              className="flex h-10 w-10 items-center justify-center rounded-stitch-pill border border-stitch-border bg-stitch-paper transition-colors hover:border-stitch-olive/40"
              aria-label="Saved patterns"
            >
              <StitchIcon name="bookmark" tone="muted" size={18} />
            </Link>

            <Link
              href="/settings"
              className="flex h-10 w-10 items-center justify-center rounded-stitch-pill border border-stitch-border bg-stitch-paper transition-colors hover:border-stitch-olive/40"
              aria-label="Notifications"
            >
              <StitchIcon name="bell" tone="muted" size={18} />
            </Link>

            <Link
              href="/marketplace"
              className="hidden h-10 w-10 items-center justify-center rounded-stitch-pill border border-stitch-border bg-stitch-paper transition-colors hover:border-stitch-olive/40 sm:flex"
              aria-label="Marketplace bag"
            >
              <StitchIcon name="star" tone="muted" size={18} />
            </Link>

            <Link
              href="/settings/profile"
              className="overflow-hidden rounded-full border-2 border-stitch-border transition-colors hover:border-stitch-olive"
              aria-label={`${displayName} account menu`}
            >
              <Image
                src={avatarUrl}
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 object-cover"
              />
            </Link>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-stitch-pill border border-stitch-border bg-stitch-paper lg:hidden"
              onClick={() => setMobileNavOpen((open) => !open)}
              aria-label="Open menu"
              aria-expanded={mobileNavOpen}
            >
              <StitchIcon name="menu" tone="muted" size={18} />
            </button>
          </div>
        </div>

        {mobileNavOpen ? (
          <nav
            className="border-t border-stitch-border bg-stitch-paper px-4 py-3 lg:hidden"
            aria-label="Mobile navigation"
          >
            <ul className="grid gap-1">
              {HOME_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={cn(
                      "block rounded-stitch-sm px-3 py-2.5 text-sm font-medium",
                      isNavActive(pathname, item.href)
                        ? "bg-stitch-olive/10 text-stitch-olive"
                        : "text-stitch-ink hover:bg-stitch-warm-white",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
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
