import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { emptyResume, type Resume } from "@/lib/resume";
import { emptyLetter, type Letter } from "@/lib/letter";

export interface StoredResume {
  id: string;
  name: string;
  updatedAt: string;
  resume: Resume;
}

export interface StoredLetter {
  id: string;
  name: string;
  updatedAt: string;
  letter: Letter;
}

function relativeTime(date: Date): string {
  const hours = Math.floor((Date.now() - date.getTime()) / 3_600_000);
  if (hours < 1) return "Updated just now";
  if (hours < 24) return `Last updated ${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Last updated yesterday";
  return `Last updated ${days} days ago`;
}

export async function getSessionUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function fetchUserResumes(userId: string): Promise<StoredResume[]> {
  const rows = await prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    updatedAt: relativeTime(row.updatedAt),
    resume: { ...emptyResume, ...(row.data as Partial<Resume>) },
  }));
}

export async function fetchSingleResume(
  docId: string,
  userId: string
): Promise<StoredResume | null> {
  const row = await prisma.resume.findFirst({ where: { id: docId, userId } });
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    updatedAt: relativeTime(row.updatedAt),
    resume: { ...emptyResume, ...(row.data as Partial<Resume>) },
  };
}

export async function fetchUserLetters(userId: string): Promise<StoredLetter[]> {
  const rows = await prisma.letter.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    updatedAt: relativeTime(row.updatedAt),
    letter: { ...emptyLetter, ...(row.data as Partial<Letter>) },
  }));
}

export async function fetchSingleLetter(
  docId: string,
  userId: string
): Promise<StoredLetter | null> {
  const row = await prisma.letter.findFirst({ where: { id: docId, userId } });
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    updatedAt: relativeTime(row.updatedAt),
    letter: { ...emptyLetter, ...(row.data as Partial<Letter>) },
  };
}