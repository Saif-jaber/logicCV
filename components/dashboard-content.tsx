"use client";

import {
  ChevronRight,
  ClipboardCheck,
  FileUser,
  LayoutTemplate,
  Mail,
  Menu,
  Search,
  FileText,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { BuildAiDialog } from "@/components/build-ai-dialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DocumentCard } from "@/components/document-card";
import { DocumentPreview } from "@/components/document-preview";
import { ResumePreview } from "@/components/resume/resume-preview";
import { LetterPreview } from "@/components/letter/letter-preview";
import { LETTER_WIDTH } from "@/lib/letter";
import type { StoredLetter, StoredResume } from "@/lib/documents";
import {
  deleteLetterAction,
  deleteResumeAction,
  renameLetterAction,
  renameResumeAction,
} from "@/app/actions/documents";
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
  {
    title: "Letters",
    subtitle: "Cover & application letters",
    icon: Mail,
    badgeClassName: "bg-rose-100 text-rose-600",
  },
];

export function DashboardContent({
  resumes,
  letters,
}: {
  resumes: StoredResume[];
  letters: StoredLetter[];
}) {
  const { openMobile } = useSidebar();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const renameDocument = async (
    id: string,
    newName: string,
    kind: "resume" | "letter"
  ) => {
    if (kind === "resume") {
      await renameResumeAction(id, newName);
    } else {
      await renameLetterAction(id, newName);
    }
    router.refresh();
  };

  const deleteDocument = async (
    id: string,
    kind: "resume" | "letter"
  ) => {
    if (kind === "resume") {
      await deleteResumeAction(id);
    } else {
      await deleteLetterAction(id);
    }
    router.refresh();
  };

  const normalized = search.trim().toLowerCase();
  const matches = (name: string) =>
    normalized === "" || name.toLowerCase().includes(normalized);
  const filteredDocuments = resumes.filter((doc) => matches(doc.name));
  const filteredLetters = letters.filter((letter) => matches(letter.name));

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
              placeholder="Search files..."
              aria-label="Search all files"
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
          <BuildAiDialog className="py-2" />
        </div>
      </header>

      <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
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

        {filteredDocuments.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] sm:gap-4">
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                name={document.name}
                updatedAt={document.updatedAt}
                href={`/dashboard/resumes/${document.id}`}
                noun="resume"
                onRename={(newName) => renameDocument(document.id, newName, "resume")}
                onDelete={() => deleteDocument(document.id, "resume")}
              >
                <DocumentPreview>
                  <ResumePreview resume={document.resume} />
                </DocumentPreview>
              </DocumentCard>
            ))}
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
            <FileText className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              {normalized === "" ? "No resumes found" : "No resumes match your search"}
            </p>
            <p className="text-sm text-muted-foreground">
              {normalized === ""
                ? "Start a new resume with the AI builder."
                : "Try a different search term."}
            </p>
            {normalized === "" ? (
              <BuildAiDialog className="rounded-full" />
            ) : (
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => setSearch("")}
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">
              My Letters
            </h2>
          </div>
          <Link
            href="/dashboard/letters"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-full"
            )}
          >
            View All
            <ChevronRight className="size-4" />
          </Link>
        </div>

        {filteredLetters.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] sm:gap-4">
            {filteredLetters
              .slice(0, normalized === "" ? 4 : filteredLetters.length)
              .map((document) => (
                <DocumentCard
                  key={document.id}
                  name={document.name}
                  updatedAt={document.updatedAt}
                  href={`/dashboard/letters/${document.id}`}
                  noun="letter"
                  onRename={(newName) => renameDocument(document.id, newName, "letter")}
                  onDelete={() => deleteDocument(document.id, "letter")}
                >
                  <DocumentPreview pageWidth={LETTER_WIDTH}>
                    <LetterPreview letter={document.letter} />
                  </DocumentPreview>
                </DocumentCard>
              ))}
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
            <Mail className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              {normalized === "" ? "No letters found" : "No letters match your search"}
            </p>
            <p className="text-sm text-muted-foreground">
              {normalized === ""
                ? "Start a new letter with the AI builder."
                : "Try a different search term."}
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