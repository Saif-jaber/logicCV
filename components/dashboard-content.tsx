"use client";

import {
  ChevronRight,
  ClipboardCheck,
  FileUser,
  Mail,
  Search,
  FileText,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { BuildAiDialog } from "@/components/build-ai-dialog";
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
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface FeatureCard {
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

const featureCards: FeatureCard[] = [
  {
    title: "CV / Resume",
    subtitle: "Better Resume Builder",
    icon: FileUser,
  },
  {
    title: "ATS Check",
    subtitle: "Optimized for hiring software",
    icon: ClipboardCheck,
  },
  {
    title: "Letters",
    subtitle: "Cover & application letters",
    icon: Mail,
  },
];

export function DashboardContent({
  resumes,
  letters,
}: {
  resumes: StoredResume[];
  letters: StoredLetter[];
}) {
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
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="db-kicker">Overview</span>
          <h1 className="db-title">Your documents</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="db-search db-focus">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files..."
              aria-label="Search all files"
              className="h-6 w-28 rounded-none border-none bg-transparent p-0 shadow-none focus-visible:ring-0 sm:w-44 lg:w-56"
            />
            {search !== "" && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
                className="db-icon-btn -m-1 h-6 w-6"
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
          <div key={feature.title} className="db-tile">
            <span className="db-tile__icon">
              <feature.icon className="size-5" />
            </span>
            <div className="db-tile__copy">
              <p className="db-tile__title">{feature.title}</p>
              <p className="db-tile__sub">{feature.subtitle}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <div className="db-section-head">
          <div className="flex items-center gap-2">
            <h2 className="db-section-title">My Resumes</h2>
            <span className="db-label-mono">/{resumes.length}</span>
            {search !== "" && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Clear search"
                className="db-icon-btn size-7"
                onClick={() => setSearch("")}
              >
                <X className="size-3.5" />
              </Button>
            )}
          </div>
          <Link
            href="/dashboard/resumes"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "db-section-link"
            )}
          >
            View all
            <ChevronRight className="size-4" />
          </Link>
        </div>

        {filteredDocuments.length > 0 ? (
          <div className="db-doc-grid mt-4">
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
          <div className="db-empty mt-4">
            <span className="db-empty__icon">
              <FileText className="size-5" />
            </span>
            <p className="db-empty__title">
              {normalized === "" ? "No resumes yet" : "No matching resumes"}
            </p>
            <p className="db-empty__copy">
              {normalized === ""
                ? "Start a new resume with the AI builder."
                : "Try a different search term."}
            </p>
            {normalized === "" ? (
              <BuildAiDialog className="mt-2 rounded-full" />
            ) : (
              <Button
                variant="outline"
                className="mt-2 rounded-full"
                onClick={() => setSearch("")}
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="db-section-head">
          <div className="flex items-center gap-2">
            <h2 className="db-section-title">My Letters</h2>
            <span className="db-label-mono">/{letters.length}</span>
          </div>
          <Link
            href="/dashboard/letters"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "db-section-link"
            )}
          >
            View all
            <ChevronRight className="size-4" />
          </Link>
        </div>

        {filteredLetters.length > 0 ? (
          <div className="db-doc-grid mt-4">
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
          <div className="db-empty mt-4">
            <span className="db-empty__icon">
              <Mail className="size-5" />
            </span>
            <p className="db-empty__title">
              {normalized === "" ? "No letters yet" : "No matching letters"}
            </p>
            <p className="db-empty__copy">
              {normalized === ""
                ? "Start a new letter with the AI builder."
                : "Try a different search term."}
            </p>
            {normalized === "" ? (
              <BuildAiDialog className="mt-2 rounded-full" />
            ) : (
              <Button
                variant="outline"
                className="mt-2 rounded-full"
                onClick={() => setSearch("")}
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}