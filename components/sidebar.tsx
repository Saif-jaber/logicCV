"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  FileText,
  LayoutGrid,
  Mail,
  Settings,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { BuildAiDialog } from "@/components/build-ai-dialog";
import { BrandMark } from "@/components/landing/brand-mark";
import { useSidebar } from "@/lib/sidebar-context";
import { cn } from "@/lib/utils";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** @deprecated use pathname matching instead */
  active?: boolean;
  highlight?: boolean;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

export type SidebarUser = {
  name?: string | null;
  email?: string | null;
};

function getInitials(user?: SidebarUser): string {
  const name = user?.name?.trim();
  if (name) {
    const parts = name.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
  }
  return user?.email?.[0]?.toUpperCase() ?? "?";
}

function getDisplayName(user?: SidebarUser): string {
  return user?.name?.trim() || user?.email || "Guest";
}

const navSections: NavSection[] = [
  {
    label: "Dashboard",
    items: [
      {
        label: "Build with AI",
        href: "/dashboard/resumes/new",
        icon: Sparkles,
        highlight: true,
      },
      {
        label: "Overview",
        href: "/dashboard",
        icon: LayoutGrid,
      },
      {
        label: "CV / Resume",
        href: "/dashboard/resumes",
        icon: FileText,
      },
      {
        label: "Letters",
        href: "/dashboard/letters",
        icon: Mail,
      },
    ],
  },
];

function NavLink({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const active =
    item.href === pathname ||
    (item.href !== "/dashboard" && pathname.startsWith(item.href));

  const icon = <item.icon className="size-[18px] shrink-0" />;
  const label = (
    <span className={cn("truncate", collapsed && "hidden")}>{item.label}</span>
  );

  if (item.label === "Build with AI") {
    return (
      <BuildAiDialog
        trigger={(open) => (
          <button
            type="button"
            onClick={open}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group/sidebar-flex inline-flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
              item.highlight && "shadow-none",
              collapsed && "justify-center px-0"
            )}
            title={collapsed ? item.label : undefined}
          >
            {collapsed ? (
              <span
                className="relative flex items-center justify-center"
                data-tooltip={item.label}
              >
                {icon}
              </span>
            ) : (
              <>
                {icon}
                {label}
              </>
            )}
          </button>
        )}
      />
    );
  }

  const classes = cn(
    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    active
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
    collapsed && "justify-center px-0"
  );

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={classes}
      title={collapsed ? item.label : undefined}
    >
      {collapsed ? (
        <span
          className="relative flex items-center justify-center"
          data-tooltip={item.label}
        >
          {icon}
        </span>
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </Link>
  );
}

function SidebarContent({
  collapsed,
  topRight,
  user,
}: {
  collapsed: boolean;
  topRight?: ReactNode;
  user?: SidebarUser;
}) {
  const { toggleCollapsed } = useSidebar();

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex items-center gap-2",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {collapsed ? (
          <BrandMark className="size-6" />
        ) : (
          <Link
            href="/dashboard"
            className="flex min-w-0 items-center gap-2 text-sidebar-foreground"
          >
            <BrandMark className="size-6" />
            <span className="truncate font-display text-lg font-bold tracking-tight">
              logicCV
            </span>
          </Link>
        )}
        {topRight ??
          (collapsed ? null : (
            <button
              type="button"
              aria-label="Collapse sidebar"
              onClick={toggleCollapsed}
              className="rounded-md p-1 text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <ChevronsLeft className="size-4" />
            </button>
          ))}
      </div>

      <div className="flex flex-col">
        {navSections.map((section) => (
          <div key={section.label} className="mt-6">
            {!collapsed && (
              <p className="px-3 font-code text-[0.625rem] uppercase tracking-[0.14em] text-sidebar-foreground/40">
                {section.label}
              </p>
            )}
            <nav className="mt-2 flex flex-col gap-1">
              {section.items.map((item) => (
                <NavLink key={item.label} item={item} collapsed={collapsed} />
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col pt-6">
        {collapsed && (
          <button
            type="button"
            aria-label="Expand sidebar"
            onClick={toggleCollapsed}
            className="mx-auto mb-4 rounded-md p-1 text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <ChevronsRight className="size-4" />
          </button>
        )}
        <Separator className="bg-sidebar-border" />
        <nav className="mt-4 flex flex-col gap-1" aria-label="Account">
          <Link
            href="/dashboard/settings"
            aria-label={collapsed ? "Settings" : undefined}
            title={collapsed ? "Settings" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
              collapsed && "justify-center px-0"
            )}
          >
            <Settings className="size-[18px] shrink-0" />
            <span className={cn("truncate", collapsed && "hidden")}>
              Settings
            </span>
          </Link>
        </nav>
        <div
          className={cn(
            "mt-4 flex items-center",
            collapsed ? "flex-col gap-2" : "gap-2"
          )}
        >
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="bg-sidebar-accent font-code text-xs font-semibold text-sidebar-accent-foreground">
              {getInitials(user)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <span className="truncate text-sm font-medium text-sidebar-accent-foreground">
                {getDisplayName(user)}
              </span>
              <span className="ml-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sidebar-primary" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DesktopSidebar({ user }: { user?: SidebarUser }) {
  const { collapsed } = useSidebar();

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar py-5 transition-[width] duration-200 ease-in-out md:flex",
        collapsed ? "w-16 px-2.5" : "w-60 px-5"
      )}
    >
      <SidebarContent collapsed={collapsed} user={user} />
    </aside>
  );
}

function MobileSidebar({ user }: { user?: SidebarUser }) {
  const { mobileOpen, closeMobile } = useSidebar();

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
          "absolute inset-0 bg-sidebar/55 transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeMobile}
      />
      <aside
        className={cn(
          "absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 shadow-xl shadow-black/30 transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-label="Navigation"
      >
        <SidebarContent
          collapsed={false}
          topRight={
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={closeMobile}
              className="rounded-md p-1 text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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

export function Sidebar({ user }: { user?: SidebarUser }) {
  return (
    <>
      <DesktopSidebar user={user} />
      <MobileSidebar user={user} />
    </>
  );
}