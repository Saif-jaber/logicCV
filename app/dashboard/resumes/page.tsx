import Link from "next/link";
import { Plus, MoreVertical, Sparkles } from "lucide-react";
import { DocumentPreview } from "@/components/document-preview";
import { buttonVariants } from "@/components/ui/button";
import { documents } from "@/lib/resume";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "My Resumes",
};

export default function ResumesPage() {
  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">
            My Resumes
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build new ones with the AI or pick up where you left off.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/resumes/new"
            className={cn(buttonVariants({ variant: "default" }), "rounded-full px-4")}
          >
            <Sparkles className="size-4" />
            Build with AI
          </Link>
        </div>
      </header>

      <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] sm:gap-4">
        {documents.map((document) => (
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

        <Link
          href="/dashboard/resumes/new"
          className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/50 text-center transition-colors hover:border-primary hover:bg-primary/5"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Plus className="size-5" />
          </span>
          <span className="text-sm font-medium text-foreground">
            Start a new resume
          </span>
          <span className="text-xs text-muted-foreground">
            Chat with the AI
          </span>
        </Link>
      </section>

      <div className="mt-8">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "rounded-full text-muted-foreground"
          )}
        >
          Back to overview
        </Link>
      </div>
    </main>
  );
}