import Link from "next/link";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DocumentCard } from "@/components/document-card";
import { DocumentPreview } from "@/components/document-preview";
import { ResumePreview } from "@/components/resume/resume-preview";
import { BuildAiDialog } from "@/components/build-ai-dialog";
import { buttonVariants } from "@/components/ui/button";
import { fetchUserResumes } from "@/lib/documents";
import {
  deleteResumeAction,
  renameResumeAction,
} from "@/app/actions/documents";
import { cn } from "@/lib/utils";

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
          <BuildAiDialog />
        </div>
      </header>

      <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] sm:gap-4">
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