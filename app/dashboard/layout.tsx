import { auth } from "@/auth";
import { Sidebar } from "@/components/sidebar";
import { MobileNavBar } from "@/components/dashboard/mobile-nav";
import { SidebarProvider } from "@/lib/sidebar-context";
import "./dashboard.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="db-shell flex min-h-screen bg-background text-foreground">
      <SidebarProvider>
        <Sidebar user={session?.user} />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileNavBar />
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
}