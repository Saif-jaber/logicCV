"use client";

import { useState } from "react";
import { MailPlus, Send, X } from "lucide-react";
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
import { cn } from "@/lib/utils";

export function InviteUserDialog() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<"user" | "admin">("user");
  const { containerRef } = useAdminSidebar();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpen(false);
  };

  return (
    <>
      <Button
        size="sm"
        aria-haspopup="dialog"
        className="rounded-full"
        onClick={() => setOpen(true)}
      >
        <MailPlus />
        Invite user
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal container={containerRef}>
          <DialogBackdrop />
          <DialogPanel>
            <div className="pr-8">
              <DialogTitle>Invite a user</DialogTitle>
              <DialogDescription className="mt-1">
                Send an invitation email with a sign-up link.
              </DialogDescription>
            </div>
            <DialogClose className="absolute top-4 right-4 rounded-md p-1.5 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground">
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </DialogClose>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="invite-email"
                  className="text-sm font-medium text-foreground"
                >
                  Email address
                </label>
                <Input
                  id="invite-email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  autoComplete="off"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span
                  id="invite-role-label"
                  className="text-sm font-medium text-foreground"
                >
                  Role
                </span>
                <div
                  role="group"
                  aria-labelledby="invite-role-label"
                  className="grid grid-cols-2 gap-2"
                >
                  {(["user", "admin"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={role === option}
                      onClick={() => setRole(option)}
                      className={cn(
                        "rounded-lg border border-border px-3 py-2 text-left transition-colors",
                        role === option
                          ? "border-primary bg-primary/5 text-foreground"
                          : "text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      <span className="block text-sm font-medium capitalize">
                        {option}
                      </span>
                      <span className="mt-0.5 block text-xs">
                        {option === "user"
                          ? "Can build resumes and letters"
                          : "Full access to the admin panel"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-1 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="rounded-full">
                  <Send />
                  Send invite
                </Button>
              </div>
            </form>
          </DialogPanel>
        </DialogPortal>
      </Dialog>
    </>
  );
}