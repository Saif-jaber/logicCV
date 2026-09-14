"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminSidebar } from "@/lib/admin-sidebar-context";

export function AdminHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  const { openMobile } = useAdminSidebar();

  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open admin navigation"
          className="rounded-full text-foreground hover:bg-muted md:hidden"
          onClick={openMobile}
        >
          <Menu className="size-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      )}
    </header>
  );
}