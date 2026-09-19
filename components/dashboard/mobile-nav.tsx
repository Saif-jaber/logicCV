"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { BrandMark } from "@/components/landing/brand-mark";
import { useSidebar } from "@/lib/sidebar-context";

export function MobileNavBar() {
  const { openMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-rule bg-background/90 px-4 backdrop-blur md:hidden">
      <button
        type="button"
        aria-label="Open menu"
        onClick={openMobile}
        className="-ml-1 rounded-full p-2 text-foreground transition-colors hover:bg-muted"
      >
        <Menu className="size-5" />
      </button>
      <Link
        href="/dashboard"
        className="flex min-w-0 items-center gap-2 text-foreground"
      >
        <BrandMark className="size-6" />
        <span className="truncate font-display text-base font-bold tracking-tight">
          logicCV
        </span>
      </Link>
    </header>
  );
}