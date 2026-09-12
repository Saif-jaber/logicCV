import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { fetchSingleResume } from "@/lib/documents";
import { ResumeBuilder } from "@/components/resume/resume-builder";

export const metadata = {
  title: "AI Resume Builder",
};

export default async function EditResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const document = await fetchSingleResume(id, userId);
  if (!document) notFound();

  return (
    <ResumeBuilder
      docId={document.id}
      initialName={document.name}
      initialResume={document.resume}
    />
  );
}