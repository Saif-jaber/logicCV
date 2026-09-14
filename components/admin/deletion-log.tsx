"use client";

import { useMemo, useState } from "react";
import { ScrollText, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/admin/empty-state";
import { Pagination } from "@/components/admin/pagination";

export type AdminDeletion = {
  id: string;
  email: string;
  reason: string;
  deletedByEmail: string;
  deletedAt: string;
};

const PAGE_SIZE = 10;

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function DeletionLog({ deletions }: { deletions: AdminDeletion[] }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const normalized = search.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      deletions.filter(
        (deletion) =>
          normalized === "" ||
          `${deletion.email} ${deletion.reason} ${deletion.deletedByEmail}`
            .toLowerCase()
            .includes(normalized)
      ),
    [deletions, normalized]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const visibleDeletions = filtered.slice(pageStart, pageStart + PAGE_SIZE);

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
            placeholder="Search deletions..."
            aria-label="Search deletions"
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

        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filtered.length}
          </span>{" "}
          {filtered.length === 1 ? "deletion" : "deletions"}
        </p>
      </div>

      {visibleDeletions.length > 0 ? (
        <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground uppercase">
                <th scope="col" className="px-4 py-3 font-semibold">
                  Account
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Reason
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Deleted by
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Deleted at
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleDeletions.map((deletion) => (
                <tr
                  key={deletion.id}
                  className="border-b border-border last:border-b-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {deletion.email}
                  </td>
                  <td className="px-4 py-3 max-w-72">
                    <p className="truncate text-muted-foreground">
                      {deletion.reason || "Not provided"}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {deletion.deletedByEmail}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {formatDate(deletion.deletedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-3">
          <EmptyState
            icon={ScrollText}
            title={
              normalized === "" ? "No deletions logged" : "No deletions match your search"
            }
            description={
              normalized === ""
                ? "Accounts that request deletion will be recorded here."
                : "Try a different search term."
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
    </div>
  );
}