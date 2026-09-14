import { AdminHeader } from "@/components/admin/admin-header";
import { InviteUserDialog } from "@/components/admin/invite-user-dialog";
import { UsersManager, type AdminUser } from "@/components/admin/users-manager";
import { deleteUserAction } from "@/app/actions/admin";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Users",
};

export default async function AdminUsersPage() {
  const rows = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { resumes: true, letters: true } },
    },
  });

  const users: AdminUser[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    createdAt: row.createdAt.toISOString(),
    resumeCount: row._count.resumes,
    letterCount: row._count.letters,
  }));

  return (
    <>
      <AdminHeader
        title="Users"
        description="Everyone with an account on logicCV."
      >
        <InviteUserDialog />
      </AdminHeader>

      <UsersManager users={users} onDelete={deleteUserAction} />
    </>
  );
}