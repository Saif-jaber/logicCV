"use client";

import { useMemo, useState } from "react";
import { Search, Trash2, UserCog, UsersRound, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPanel,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAdminSidebar } from "@/lib/admin-sidebar-context";
import { EmptyState } from "@/components/admin/empty-state";
import { Pagination } from "@/components/admin/pagination";
import { cn } from "@/lib/utils";

export type AdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  role: "user" | "admin";
  createdAt: string;
  resumeCount: number;
  letterCount: number;
};

type RoleFilter = "all" | "admin" | "user";

const PAGE_SIZE = 10;

function getInitials(user: Pick<AdminUser, "name" | "email">): string {
  const value = user.name?.trim();
  if (value) {
    const parts = value.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
  }
  return user.email?.[0]?.toUpperCase() ?? "?";
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(iso)
  );
}

export function UsersManager({
  users,
  onToggleRole,
  onDelete,
}: {
  users: AdminUser[];
  onToggleRole?: (userId: string) => void | Promise<void>;
  onDelete?: (userId: string, reason: string) => void | Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<AdminUser | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [busy, setBusy] = useState(false);
  const { containerRef } = useAdminSidebar();

  const normalized = search.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      users.filter(
        (user) =>
          (roleFilter === "all" || user.role === roleFilter) &&
          (normalized === "" ||
            `${user.name ?? ""} ${user.email ?? ""}`
              .toLowerCase()
              .includes(normalized))
      ),
    [users, normalized, roleFilter]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const visibleUsers = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const roleFilters: { id: RoleFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "admin", label: "Admins" },
    { id: "user", label: "Users" },
  ];

  const handleToggleRole = async (user: AdminUser) => {
    setBusy(true);
    try {
      await onToggleRole?.(user.id);
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setBusy(true);
    try {
      await onDelete?.(pendingDelete.id, deleteReason.trim());
    } finally {
      setBusy(false);
      setPendingDelete(null);
      setDeleteReason("");
    }
  };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-transparent px-3 py-1.5 transition-colors focus-within:border-ring">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search users..."
            aria-label="Search users"
            className="h-6 w-40 rounded-none border-none p-0 shadow-none focus-visible:ring-0 dark:bg-transparent! sm:w-52"
          />
          {search !== "" && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch("")}
              className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div
          role="group"
          aria-label="Filter by role"
          className="flex items-center gap-1 rounded-full border border-border bg-muted/50 p-1"
        >
          {roleFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              aria-pressed={roleFilter === filter.id}
              onClick={() => {
                setRoleFilter(filter.id);
                setPage(1);
              }}
              className={cn(
                "rounded-full px-3 py-1 text-sm font-medium transition-colors",
                roleFilter === filter.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground" role="status">
        {filtered.length === 0
          ? "No users found"
          : `${filtered.length} ${filtered.length === 1 ? "user" : "users"} total`}
      </p>

      {visibleUsers.length > 0 ? (
        <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground uppercase">
                <th scope="col" className="px-4 py-3 font-semibold">
                  User
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Role
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Joined
                </th>
                <th scope="col" className="px-4 py-3 text-center font-semibold">
                  Resumes
                </th>
                <th scope="col" className="px-4 py-3 text-center font-semibold">
                  Letters
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border last:border-b-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className="bg-blue-100 text-xs font-semibold text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                          {getInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {user.name || "Unnamed user"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className="rounded-full"
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-foreground">
                    {user.resumeCount}
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-foreground">
                    {user.letterCount}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={busy}
                        title={
                          user.role === "admin"
                            ? "Remove admin role"
                            : "Make admin"
                        }
                        aria-label={
                          user.role === "admin"
                            ? `Remove ${user.name ?? user.email} from admins`
                            : `Make ${user.name ?? user.email} an admin`
                        }
                        onClick={() => handleToggleRole(user)}
                      >
                        <UserCog />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={busy}
                        title="Delete user"
                        aria-label={`Delete ${user.name ?? user.email}`}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                          setPendingDelete(user);
                          setDeleteReason("");
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-3">
          <EmptyState
            icon={UsersRound}
            title={normalized === "" ? "No users" : "No users match your search"}
            description={
              normalized === ""
                ? "Accounts that sign up will appear here."
                : "Try a different search term or filter."
            }
          />
        </div>
      )}

      <div className="mt-2">
        <Pagination
          page={safePage}
          pageCount={pageCount}
          onPageChange={setPage}
        />
      </div>

      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(next) => {
          if (!next) setPendingDelete(null);
        }}
      >
        <DialogPortal container={containerRef}>
          <DialogBackdrop />
          <DialogPanel className="max-w-sm">
            <div className="pr-8">
              <DialogTitle>Delete {pendingDelete?.name ?? "user"}?</DialogTitle>
              <DialogDescription className="mt-1">
                This permanently removes{" "}
                <span className="font-medium text-foreground">
                  {pendingDelete?.email}
                </span>
                and all of their resumes, letters and API keys. This action
                cannot be undone.
              </DialogDescription>
            </div>
            <DialogClose className="absolute top-4 right-4 rounded-md p-1.5 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground">
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <div className="mt-4 flex flex-col gap-1.5">
              <label
                htmlFor="delete-reason"
                className="text-sm font-medium text-foreground"
              >
                Reason for deletion
              </label>
              <textarea
                id="delete-reason"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="e.g. Duplicate account, policy violation..."
                rows={2}
                maxLength={280}
                autoFocus
                className="min-h-16 w-full resize-none rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 md:text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Saved against this account in the deletion log.
              </p>
            </div>
            <div className="mt-5 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setPendingDelete(null)}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={busy}
                onClick={confirmDelete}
                className="rounded-full"
              >
                <Trash2 />
                Delete user
              </Button>
            </div>
          </DialogPanel>
        </DialogPortal>
      </Dialog>
    </div>
  );
}