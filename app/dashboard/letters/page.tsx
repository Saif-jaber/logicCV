import Link from "next/link";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DocumentCard } from "@/components/document-card";
import { DocumentPreview } from "@/components/document-preview";
import { LetterPreview } from "@/components/letter/letter-preview";
import { BuildAiDialog } from "@/components/build-ai-dialog";
import { buttonVariants } from "@/components/ui/button";
import { LETTER_WIDTH } from "@/lib/letter";
import { fetchUserLetters } from "@/lib/documents";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "My Letters",
};

export default async function LettersPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/sign-in");

  const letters = await fetchUserLetters(userId);

  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">
            My Letters
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cover letters for a specific role, or application letters showing
            interest in a company.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BuildAiDialog />
        </div>
      </header>

      <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] sm:gap-4">
        {letters.map((document) => (
          <DocumentCard
            key={document.id}
            name={document.name}
            updatedAt={document.updatedAt}
            href={`/dashboard/letters/${document.id}`}
          >
            <DocumentPreview pageWidth={LETTER_WIDTH}>
              <LetterPreview letter={document.letter} />
            </DocumentPreview>
          </DocumentCard>
        ))}

        <Link
          href="/dashboard/letters/new"
          className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/50 text-center transition-colors hover:border-primary hover:bg-primary/5"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Plus className="size-5" />
          </span>
          <span className="text-sm font-medium text-foreground">
            Start a new letter
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