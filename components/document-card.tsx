"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Menu } from "@base-ui/react/menu";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPanel,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function DocumentCard({
  name,
  updatedAt,
  children,
  href,
  noun = "document",
  onRename,
  onDelete,
}: {
  name: string;
  updatedAt: string;
  children: React.ReactNode;
  href?: string;
  noun?: string;
  onRename?: (name: string) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  async function commitRename() {
    const next = draft.trim();
    setEditing(false);
    if (next === "" || next === name || !onRename) return;
    await onRename(next);
    router.refresh();
  }

  async function confirmDelete() {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete();
      setDeleteOpen(false);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  const preview = href ? (
    <Link href={href} aria-label={`Open ${name}`} className="block aspect-[3/4] w-full">
      {children}
    </Link>
  ) : (
    <div className="aspect-[3/4] w-full">{children}</div>
  );

  const title =
    editing && onRename ? (
      <form
        className="flex min-w-0 items-center gap-1.5"
        onSubmit={(event) => {
          event.preventDefault();
          void commitRename();
        }}
      >
        <Input
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setDraft(name);
              setEditing(false);
            }
          }}
          className="h-7 rounded-md px-2 py-0 text-sm"
        />
        <button
          type="submit"
          aria-label="Save name"
          className="shrink-0 rounded-full p-1 text-emerald-600 transition-colors hover:bg-muted"
        >
          <Check className="size-3.5" />
        </button>
      </form>
    ) : href ? (
      <Link href={href} className="block min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{name}</p>
      </Link>
    ) : (
      <p className="truncate text-sm font-semibold text-foreground">{name}</p>
    );

  const actions = onRename || onDelete ? (
    <Menu.Root>
      <Menu.Trigger
        aria-label={`More options for ${name}`}
        className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <MoreVertical className="size-4" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={6} align="end" className="z-50">
          <Menu.Popup className="min-w-40 rounded-lg border border-border bg-popover p-1 shadow-lg shadow-black/5 outline-none">
            {onRename && (
              <Menu.Item
                onClick={() => {
                  setDraft(name);
                  setEditing(true);
                }}
                className="flex cursor-default items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-foreground outline-none select-none data-highlighted:bg-muted"
              >
                <Pencil className="size-3.5 text-muted-foreground" />
                Rename
              </Menu.Item>
            )}
            {onDelete && (
              <>
                <Menu.Separator className="my-1 h-px bg-border" />
                <Menu.Item
                  onClick={() => setDeleteOpen(true)}
                  className="flex cursor-default items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-red-600 outline-none select-none data-highlighted:bg-red-50"
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </Menu.Item>
              </>
            )}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ) : (
    <button
      type="button"
      aria-label={`More options for ${name}`}
      className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <MoreVertical className="size-4" />
    </button>
  );

  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-sm">
      {preview}
      <div className="flex items-center justify-between gap-2 px-2.5 py-2.5">
        <div className="min-w-0">
          {title}
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {updatedAt}
          </p>
        </div>
        {actions}
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogPortal>
          <DialogBackdrop />
          <DialogPanel>
            <DialogTitle>Delete {name}?</DialogTitle>
            <DialogDescription>
              This permanently deletes the {noun}. This action cannot be
              undone.
            </DialogDescription>
            <div className="mt-6 flex justify-end gap-2">
              <DialogClose
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-full"
                )}
              >
                Cancel
              </DialogClose>
              <button
                type="button"
                onClick={() => void confirmDelete()}
                disabled={deleting}
                className={cn(
                  buttonVariants({ variant: "destructive", size: "sm" }),
                  "rounded-full"
                )}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </DialogPanel>
        </DialogPortal>
      </Dialog>
    </article>
  );
}