import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { fetchSingleLetter } from "@/lib/documents";
import { LetterBuilder } from "@/components/letter/letter-builder";

export const metadata = {
  title: "AI Letter Builder",
};

export default async function EditLetterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const document = await fetchSingleLetter(id, userId);
  if (!document) notFound();

  return (
    <LetterBuilder
      docId={document.id}
      initialName={document.name}
      initialLetter={document.letter}
    />
  );
}