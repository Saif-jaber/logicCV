import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { emptyLetter } from "@/lib/letter";

export const metadata = {
  title: "AI Letter Builder",
};

export default async function NewLetterPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/sign-in");

  const document = await prisma.letter.create({
    data: {
      userId,
      name: "Untitled Letter",
      kind: "cover",
      data: emptyLetter as unknown as Prisma.InputJsonValue,
    },
  });

  redirect(`/dashboard/letters/${document.id}`);
}