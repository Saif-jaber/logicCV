import { AdminHeader } from "@/components/admin/admin-header";
import {
  DeletionLog,
  type AdminDeletion,
} from "@/components/admin/deletion-log";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Deletion Log",
};

export default async function AdminDeletionsPage() {
  const rows = await prisma.userDeletion.findMany({
    orderBy: { deletedAt: "desc" },
    select: {
      id: true,
      email: true,
      reason: true,
      deletedByEmail: true,
      deletedAt: true,
    },
  });

  const deletions: AdminDeletion[] = rows.map((row) => ({
    ...row,
    deletedAt: row.deletedAt.toISOString(),
  }));

  return (
    <>
      <AdminHeader
        title="Deletion Log"
        description="Record of every account that was deleted."
      />
      <DeletionLog deletions={deletions} />
    </>
  );
}