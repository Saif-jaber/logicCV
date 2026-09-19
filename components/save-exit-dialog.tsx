"use client";

import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
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

type SaveExitDialogProps = {
  href: string;
  label: string;
  description?: string;
};

export function SaveExitDialog({
  href,
  label,
  description,
}: SaveExitDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSaveAndExit = () => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "db-section-link"
        )}
      >
        <ArrowLeft className="size-4" />
        {label}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogBackdrop />
          <DialogPanel>
            <div className="pr-8">
              <DialogTitle>Save and exit?</DialogTitle>
              <DialogDescription className="mt-1">
                {description ??
                  "Your progress is saved to your account before you leave."}
              </DialogDescription>
            </div>
            <DialogClose className="absolute top-4 right-4 rounded-md p-1.5 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground">
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <div className="mt-6 flex flex-col gap-2">
              <Button onClick={handleSaveAndExit} className="w-full">
                Save and exit
              </Button>
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                className="w-full text-muted-foreground"
              >
                Keep editing
              </Button>
            </div>
          </DialogPanel>
        </DialogPortal>
      </Dialog>
    </>
  );
}