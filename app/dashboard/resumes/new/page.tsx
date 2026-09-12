import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { emptyResume } from "@/lib/resume";

export const metadata = {
  title: "AI Resume Builder",
};

export default async function NewResumePage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/sign-in");

  const document = await prisma.resume.create({
    data: {
      userId,
      name: "Untitled Resume",
      data: emptyResume as unknown as Prisma.InputJsonValue,
    },
  });

  redirect(`/dashboard/resumes/${document.id}`);
}