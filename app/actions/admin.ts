"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function deleteUserAction(userId: string, reason: string): Promise<void> {
  const session = await auth();
  if (session?.user?.role !== "admin") return;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });
  if (!user) return;

  await prisma.$transaction([
    prisma.userDeletion.create({
      data: {
        userId: user.id,
        email: user.email ?? "unknown",
        reason: reason || "Not provided",
        deletedByUserId: (session.user?.id as string | undefined) ?? "system",
        deletedByEmail: session.user?.email ?? "system",
      },
    }),
    prisma.user.delete({ where: { id: user.id } }),
  ]);

  revalidatePath("/admin/users");
  revalidatePath("/admin/deletions");
}