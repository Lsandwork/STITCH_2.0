"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND, NAV_ITEMS } from "@/lib/constants";
import { formatMonthlyPrice, getBillingPlan } from "@/lib/billing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { StitchIcon } from "@/components/stitch/StitchIcon";

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const plusPlan = getBillingPlan("stitch_plus");

  const navContent = (
    <>
      <div className="mb-6">
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <Image
            src={BRAND.logoHorizontal}
            alt={BRAND.name}
            width={220}
            height={68}
            priority
            className="h-auto w-full max-w-[220px]"
          />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              data-active={active}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-stitch-peach text-stitch-coral"
                  : "text-stitch-ink hover:bg-stitch-peach/70",
              )}
            >
              <StitchIcon
                name={item.icon}
                tone={active ? "coral" : "muted"}
                size={22}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-stitch-lg border border-stitch-border bg-stitch-peach p-4">
        <div className="flex items-start gap-3">
          <StitchIcon name="crown" tone="gold" size={28} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-stitch-ink">Stitch Plus</p>
            <p className="mt-1 text-xs leading-relaxed text-stitch-muted">
              Unlock AI patterns, voice player, and unlimited projects from{" "}
              {formatMonthlyPrice(plusPlan.monthlyPriceCents)}.
            </p>
            <Button href="/settings/subscription" size="sm" className="mt-3 w-full">
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-[11px] text-stitch-muted">
        {BRAND.domain}
      </p>
    </>
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-stitch-md border border-stitch-border bg-stitch-paper shadow-stitch-card md:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <StitchIcon name="menu" tone="muted" />
      </button>

      <aside className="stitch-sidebar hidden md:flex md:flex-col">{navContent}</aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-stitch-ink/30"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          />
          <aside className="absolute inset-y-0 left-0 flex w-[272px] max-w-[85vw] flex-col overflow-y-auto border-r border-stitch-border bg-stitch-paper p-6 shadow-stitch-floating">
            <button
              type="button"
              className="mb-4 ml-auto flex h-9 w-9 items-center justify-center rounded-stitch-sm hover:bg-stitch-peach"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              <StitchIcon name="close" tone="muted" />
            </button>
            {navContent}
          </aside>
        </div>
      ) : null}
    </>
  );
}
