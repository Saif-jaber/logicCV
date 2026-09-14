"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  LayoutDashboard,
  ScrollText,
  ShieldCheck,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAdminSidebar } from "@/lib/admin-sidebar-context";
import { cn } from "@/lib/utils";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type AdminNavSection = {
  label: string;
  items: AdminNavItem[];
};

const sections: AdminNavSection[] = [
  {
    label: "Manage",
    items: [
      { label: "Overview", href: "/admin", icon: LayoutDashboard },
      { label: "Users", href: "/admin/users", icon: UsersRound },
      { label: "Deletion Log", href: "/admin/deletions", icon: ScrollText },
    ],
  },
];

export type AdminSidebarUser = {
  name?: string | null;
  email?: string | null;
};

function getInitials(user?: AdminSidebarUser): string {
  const value = user?.name?.trim();
  if (value) {
    const parts = value.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
  }
  return user?.email?.[0]?.toUpperCase() ?? "A";
}

function getDisplayName(user?: AdminSidebarUser): string {
  return user?.name?.trim() || user?.email || "Administrator";
}

function NavLink({
  item,
  collapsed,
}: {
  item: AdminNavItem;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const active =
    item.href === pathname ||
    (item.href !== "/admin" && pathname.startsWith(item.href));

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        collapsed && "justify-center px-0"
      )}
    >
      <span
        className={cn(
          "flex w-full items-center gap-2.5",
          collapsed && "justify-center gap-0"
        )}
      >
        <item.icon className="size-[18px] shrink-0" />
        <span className={cn("truncate", collapsed && "hidden")}>
          {item.label}
        </span>
      </span>
    </Link>
  );
}

function AdminSidebarContent({
  collapsed,
  topRight,
  user,
}: {
  collapsed: boolean;
  topRight?: ReactNode;
  user?: AdminSidebarUser;
}) {
  const { toggleCollapsed } = useAdminSidebar();

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex items-center justify-between rounded-lg bg-primary/5 py-2",
          collapsed ? "px-2" : "px-2.5"
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ShieldCheck className="size-4" />
          </span>
          {!collapsed && (
            <span className="truncate text-sm font-bold tracking-tight text-foreground">
              logicCV
              <span className="ml-1.5 rounded-sm bg-primary/10 px-1 py-0.5 align-middle text-[10px] font-semibold tracking-wide text-primary uppercase">
                Admin
              </span>
            </span>
          )}
        </div>
        {topRight ?? (
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={toggleCollapsed}
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {collapsed ? (
              <ChevronsRight className="size-4" />
            ) : (
              <ChevronsLeft className="size-4" />
            )}
          </button>
        )}
      </div>

      <div className="flex flex-col">
        {sections.map((section) => (
          <div key={section.label} className="mt-6">
            {!collapsed && (
              <p className="px-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                {section.label}
              </p>
            )}
            <nav className="mt-2 flex flex-col gap-1">
              {section.items.map((item) => (
                <NavLink key={item.href} item={item} collapsed={collapsed} />
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col pt-6">
        <Separator />
        <nav className="mt-4 flex flex-col gap-1" aria-label="Admin links">
          <Link
            href="/dashboard"
            aria-label={collapsed ? "Back to the app" : undefined}
            title={collapsed ? "Back to the app" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground",
              collapsed && "justify-center px-0"
            )}
          >
            <ExternalLink className="size-[18px] shrink-0" />
            <span className={cn("truncate", collapsed && "hidden")}>
              Back to the app
            </span>
          </Link>
        </nav>
        <div
          className={cn(
            "mt-4 flex items-center gap-2 rounded-lg border border-border p-2",
            collapsed && "justify-center border-transparent p-0"
          )}
        >
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {getInitials(user)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {getDisplayName(user)}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Administrator
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DesktopSidebar({ user }: { user?: AdminSidebarUser }) {
  const { collapsed } = useAdminSidebar();

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-border bg-card py-5 transition-[width] duration-200 ease-in-out md:flex",
        collapsed ? "w-16 px-2.5" : "w-60 px-5"
      )}
    >
      <AdminSidebarContent collapsed={collapsed} user={user} />
    </aside>
  );
}

function MobileSidebar({ user }: { user?: AdminSidebarUser }) {
  const { mobileOpen, closeMobile } = useAdminSidebar();

  useEffect(() => {
    if (!mobileOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen, closeMobile]);

  return (
    <div
      className="fixed inset-0 z-50 md:hidden"
      aria-hidden={!mobileOpen}
      inert={!mobileOpen}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeMobile}
      />
      <aside
        className={cn(
          "absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-border bg-card px-4 py-5 shadow-xl transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-label="Admin navigation"
      >
        <AdminSidebarContent
          collapsed={false}
          topRight={
            <button
              type="button"
              aria-label="Close admin navigation"
              onClick={closeMobile}
              className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          }
          user={user}
        />
      </aside>
    </div>
  );
}

export function AdminNav({ user }: { user?: AdminSidebarUser }) {
  return (
    <>
      <DesktopSidebar user={user} />
      <MobileSidebar user={user} />
    </>
  );
}