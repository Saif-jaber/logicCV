import { AdminNav } from "@/components/admin/admin-nav";
import { AdminSidebarProvider } from "@/lib/admin-sidebar-context";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSidebarProvider className="dark flex min-h-screen bg-background">
      <AdminNav />
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </AdminSidebarProvider>
  );
}