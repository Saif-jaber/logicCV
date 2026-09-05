import { Sidebar } from "@/components/sidebar";
import { SidebarProvider } from "@/lib/sidebar-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <SidebarProvider>
        <Sidebar />
        {children}
      </SidebarProvider>
    </div>
  );
}