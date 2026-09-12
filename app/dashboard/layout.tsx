import { auth } from "@/auth";
import { Sidebar } from "@/components/sidebar";
import { SidebarProvider } from "@/lib/sidebar-context";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarProvider>
        <Sidebar user={session?.user} />
        {children}
      </SidebarProvider>
    </div>
  );
}