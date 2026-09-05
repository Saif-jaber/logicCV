"use client";

import {
  ChevronRight,
  ClipboardCheck,
  FileUser,
  LayoutTemplate,
  Menu,
  MoreVertical,
  Search,
  FileText,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DocumentPreview } from "@/components/document-preview";
import { documents } from "@/lib/resume";
import { useSidebar } from "@/lib/sidebar-context";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface FeatureCard {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  badgeClassName: string;
}

const featureCards: FeatureCard[] = [
  {
    title: "CV / Resume",
    subtitle: "Better Resume Builder",
    icon: FileUser,
    badgeClassName: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Templates",
    subtitle: "Stand out with pro templates",
    icon: LayoutTemplate,
    badgeClassName: "bg-blue-100 text-blue-600",
  },
  {
    title: "ATS Check",
    subtitle: "Optimized for hiring software",
    icon: ClipboardCheck,
    badgeClassName: "bg-violet-100 text-violet-600",
  },
];

export function DashboardContent() {
  const { openMobile } = useSidebar();
  const [search, setSearch] = useState("");

  const normalized = search.trim().toLowerCase();
  const filtered = documents.filter(
    (doc) => normalized === "" || doc.name.toLowerCase().includes(normalized)
  );

  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            className="rounded-full text-foreground hover:bg-muted md:hidden"
            onClick={openMobile}
          >
            <Menu className="size-5" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">
            Overview
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-transparent px-3 py-1.5 transition-colors focus-within:border-ring">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resumes..."
              aria-label="Search resumes"
              className="h-6 w-32 rounded-none border-none p-0 shadow-none focus-visible:ring-0 sm:w-48 lg:w-56"
            />
            {search !== "" && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
                className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <Link
            href="/dashboard/resumes/new"
            className={cn(
              buttonVariants({ variant: "default" }),
              "rounded-full px-4 py-2 md:hidden"
            )}
          >
            <Sparkles className="size-4" />
            Build with AI
          </Link>
        </div>
      </header>

      <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {featureCards.map((feature) => (
          <Card
            key={feature.title}
            className="flex-row items-center gap-3 border border-border ring-0 bg-card p-3.5 sm:gap-4 sm:p-4"
          >
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg sm:size-10",
                feature.badgeClassName
              )}
            >
              <feature.icon className="size-[18px] sm:size-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {feature.title}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {feature.subtitle}
              </p>
            </div>
          </Card>
        ))}
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">
              My Resumes
            </h2>
            {search !== "" && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Clear search"
                className="size-7 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setSearch("")}
              >
                <X className="size-3.5" />
              </Button>
            )}
          </div>
          <Link
            href="/dashboard/resumes"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-full"
            )}
          >
            View All
            <ChevronRight className="size-4" />
          </Link>
        </div>

        {filtered.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] sm:gap-4">
            {filtered.map((document) => (
              <article
                key={document.id}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-sm"
              >
                <div className="aspect-[3/4] w-full">
                  <DocumentPreview tone={document.tone} />
                </div>
                <div className="flex items-center justify-between gap-2 px-2.5 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {document.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {document.updatedAt}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`More options for ${document.name}`}
                    className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <MoreVertical className="size-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
            <FileText className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              No resumes found
            </p>
            <p className="text-sm text-muted-foreground">
              Try a different search term.
            </p>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setSearch("")}
            >
              Clear search
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}