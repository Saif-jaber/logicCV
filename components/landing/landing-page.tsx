"use client";

import { useEffect, useState } from "react";
import { LandingNav } from "./landing-nav";
import { LandingHero } from "./landing-hero";
import { LandingSections } from "./landing-sections";
import { LandingFooter } from "./landing-footer";
import { AuthModalProvider } from "./auth-modal";
import { CommandPalette } from "./command-palette";
import "./landing.css";

export function LandingPage() {
  const [cmdkOpen, setCmdkOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (typeof key !== "string") return;
      const isK = key.toLowerCase() === "k";
      if (isK && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdkOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <AuthModalProvider>
      <div className="landing-shell relative min-h-screen">
        <LandingNav onOpenPalette={() => setCmdkOpen(true)} />
        <main>
          <LandingHero />
          <LandingSections />
        </main>
        <LandingFooter />
        <CommandPalette open={cmdkOpen} onOpenChange={setCmdkOpen} />
      </div>
    </AuthModalProvider>
  );
}