"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Resume } from "@/lib/resume";
import type { Letter } from "@/lib/letter";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }
  return session.user.id;
}

export async function saveResumeAction(
  docId: string,
  name: string,
  data: Resume
): Promise<void> {
  const userId = await requireUserId();
  await prisma.resume.updateMany({
    where: { id: docId, userId },
    data: { name, data: data as object },
  });
}

export async function saveLetterAction(
  docId: string,
  name: string,
  data: Letter
): Promise<void> {
  const userId = await requireUserId();
  await prisma.letter.updateMany({
    where: { id: docId, userId },
    data: {
      name,
      kind: data.kind,
      data: data as object,
    },
  });
}

export async function renameResumeAction(
  docId: string,
  name: string
): Promise<void> {
  const userId = await requireUserId();
  await prisma.resume.updateMany({
    where: { id: docId, userId },
    data: { name },
  });
}

export async function renameLetterAction(
  docId: string,
  name: string
): Promise<void> {
  const userId = await requireUserId();
  await prisma.letter.updateMany({
    where: { id: docId, userId },
    data: { name },
  });
}

export async function deleteResumeAction(docId: string): Promise<void> {
  const userId = await requireUserId();
  await prisma.resume.deleteMany({ where: { id: docId, userId } });
}

export async function deleteLetterAction(docId: string): Promise<void> {
  const userId = await requireUserId();
  await prisma.letter.deleteMany({ where: { id: docId, userId } });
}