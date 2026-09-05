"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BrandMark } from "./brand-mark";
import { useAuthModal } from "./auth-modal";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Wall of love", href: "#wall-of-love" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const { open } = useAuthModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 w-full max-w-6xl px-4 animate-in fade-in slide-in-from-top-4 ease-out fill-mode-both">
        <nav
          className={cn(
            "flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 transition-all duration-300",
            scrolled
              ? "border-border bg-card/95 shadow-lg shadow-black/[0.05] backdrop-blur"
              : "border-border/70 bg-card/75 backdrop-blur"
          )}
        >
          <Link
            href="/"
            className="group flex items-center gap-2.5 cursor-pointer"
            aria-label="logicCV home"
          >
            <BrandMark className="size-8 shrink-0 transition-transform duration-200 group-hover:scale-105" />
            <span className="text-base font-bold tracking-tight text-foreground">
              logicCV
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
                <span className="mt-0.5 block h-px origin-left scale-x-0 bg-foreground transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => open("signin")}
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "rounded-full px-4 cursor-pointer"
              )}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => open("signup", "/dashboard/resumes/new")}
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "rounded-full px-4 cursor-pointer shadow-sm transition-shadow duration-200 hover:shadow-md hover:shadow-primary/20"
              )}
            >
              Get started
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}