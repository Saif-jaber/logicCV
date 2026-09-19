import Link from "next/link";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DocumentCard } from "@/components/document-card";
import { DocumentPreview } from "@/components/document-preview";
import { ResumePreview } from "@/components/resume/resume-preview";
import { BuildAiDialog } from "@/components/build-ai-dialog";
import { fetchUserResumes } from "@/lib/documents";
import {
  deleteResumeAction,
  renameResumeAction,
} from "@/app/actions/documents";

export const metadata = {
  title: "My Resumes",
};

export default async function ResumesPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/sign-in");

  const documents = await fetchUserResumes(userId);

  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="db-kicker">Library</span>
          <h1 className="db-title">My Resumes</h1>
          <p className="db-lede">
            Build new ones with the AI or pick up where you left off.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BuildAiDialog />
        </div>
      </header>

      <section className="db-doc-grid mt-6">
        {documents.map((document) => (
          <DocumentCard
            key={document.id}
            name={document.name}
            updatedAt={document.updatedAt}
            href={`/dashboard/resumes/${document.id}`}
            noun="resume"
            onRename={renameResumeAction.bind(null, document.id)}
            onDelete={deleteResumeAction.bind(null, document.id)}
          >
            <DocumentPreview>
              <ResumePreview resume={document.resume} />
            </DocumentPreview>
          </DocumentCard>
        ))}

        <Link href="/dashboard/resumes/new" className="db-new-tile">
          <span className="db-new-tile__icon">
            <Plus className="size-5" />
          </span>
          <span className="db-new-tile__label">Start a new resume</span>
          <span className="db-new-tile__hint">Chat with the AI</span>
        </Link>
      </section>
    </main>
  );
}