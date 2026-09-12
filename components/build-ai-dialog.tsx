"use client";

import {
  ChevronRight,
  FileText,
  Mail,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
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

type BuildOption = {
  href: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconClassName: string;
};

const buildOptions: BuildOption[] = [
  {
    href: "/dashboard/resumes/new",
    title: "Resume / CV",
    subtitle: "ATS-friendly resume, built as you chat.",
    icon: FileText,
    iconClassName: "bg-blue-100 text-blue-600",
  },
  {
    href: "/dashboard/letters/new",
    title: "Cover Letter",
    subtitle: "Persuasive letter for a specific role.",
    icon: Mail,
    iconClassName: "bg-rose-100 text-rose-600",
  },
];

export function BuildAiDialog({
  trigger,
  className,
}: {
  trigger?: (open: () => void) => ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleChoose = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      {trigger ? (
        trigger(() => setOpen(true))
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            buttonVariants({ variant: "default" }),
            "rounded-full px-4",
            className
          )}
        >
          <Sparkles className="size-4" />
          Build with AI
        </button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogBackdrop />
          <DialogPanel>
            <div className="pr-8">
              <DialogTitle>What do you want to build?</DialogTitle>
              <DialogDescription className="mt-1">
                Pick a starting point and the AI assistant will handle the rest.
              </DialogDescription>
            </div>
            <DialogClose className="absolute top-4 right-4 rounded-md p-1.5 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground">
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <div className="mt-5 flex flex-col gap-2.5">
              {buildOptions.map((option) => (
                <button
                  key={option.href}
                  type="button"
                  onClick={() => handleChoose(option.href)}
                  className="group flex items-center gap-3.5 rounded-xl border border-border bg-card p-3.5 text-left transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg",
                      option.iconClassName
                    )}
                  >
                    <option.icon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-foreground">
                      {option.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {option.subtitle}
                    </span>
                  </span>
                  <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </button>
              ))}
            </div>
          </DialogPanel>
        </DialogPortal>
      </Dialog>
    </>
  );
}