"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { StitchIcon } from "@/components/stitch/StitchIcon";

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="Mobile navigation"
    >
      {MOBILE_NAV_ITEMS.map((item) => {
        const active = isNavActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            data-active={active}
            className={cn(
              "min-h-[44px] text-xs font-medium transition-colors",
              active ? "text-stitch-coral" : "text-stitch-muted",
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
  );
}
