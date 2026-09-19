import Link from "next/link";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DocumentCard } from "@/components/document-card";
import { DocumentPreview } from "@/components/document-preview";
import { LetterPreview } from "@/components/letter/letter-preview";
import { BuildAiDialog } from "@/components/build-ai-dialog";
import { LETTER_WIDTH } from "@/lib/letter";
import { fetchUserLetters } from "@/lib/documents";
import {
  deleteLetterAction,
  renameLetterAction,
} from "@/app/actions/documents";

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
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="db-kicker">Library</span>
          <h1 className="db-title">My Letters</h1>
          <p className="db-lede">
            Cover letters for a specific role, or application letters showing
            interest in a company.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BuildAiDialog />
        </div>
      </header>

      <section className="db-doc-grid mt-6">
        {letters.map((document) => (
          <DocumentCard
            key={document.id}
            name={document.name}
            updatedAt={document.updatedAt}
            href={`/dashboard/letters/${document.id}`}
            noun="letter"
            onRename={renameLetterAction.bind(null, document.id)}
            onDelete={deleteLetterAction.bind(null, document.id)}
          >
            <DocumentPreview pageWidth={LETTER_WIDTH}>
              <LetterPreview letter={document.letter} />
            </DocumentPreview>
          </DocumentCard>
        ))}

        <Link href="/dashboard/letters/new" className="db-new-tile">
          <span className="db-new-tile__icon">
            <Plus className="size-5" />
          </span>
          <span className="db-new-tile__label">Start a new letter</span>
          <span className="db-new-tile__hint">Chat with the AI</span>
        </Link>
      </section>
    </main>
  );
}