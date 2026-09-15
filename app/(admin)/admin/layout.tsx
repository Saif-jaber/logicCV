import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminSidebarProvider } from "@/lib/admin-sidebar-context";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    notFound();
  }

  return (
    <AdminSidebarProvider className="dark flex min-h-screen bg-background">
      <AdminNav user={session.user} />
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </AdminSidebarProvider>
  );
}