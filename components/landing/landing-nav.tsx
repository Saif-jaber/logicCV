"use client";

import Link from "next/link";
import { Command, Search } from "lucide-react";
import { BrandMark } from "./brand-mark";
import { useAuthModal } from "./auth-modal";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Wall of love", href: "#wall-of-love" },
];

export function LandingNav({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { open } = useAuthModal();

  return (
    <header className="lp-nav">
      <div className="lp-container lp-nav__inner">
        <Link href="/" className="lp-nav__brand lp-focus" aria-label="logicCV home">
          <BrandMark className="size-7" />
          <span>logicCV</span>
        </Link>

        <nav className="lp-nav__links" aria-label="Landing">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="lp-focus">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="lp-nav__actions">
          <button
            type="button"
            onClick={onOpenPalette}
            className="lp-search lp-focus"
            aria-label="Open command palette"
          >
            <Search className="size-4 shrink-0" aria-hidden />
            <span className="lp-search__label">Go to…</span>
            <span className="lp-search__kbd" aria-hidden>
              <Command className="size-3" />K
            </span>
          </button>

          <button
            type="button"
            onClick={() => open("signin")}
            className="lp-cta-ghost lp-focus lp-nav__signin"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => open("signup", "/dashboard/resumes/new")}
            className="lp-cta lp-focus"
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  );
}