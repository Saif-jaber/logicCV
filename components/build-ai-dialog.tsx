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
};

const buildOptions: BuildOption[] = [
  {
    href: "/dashboard/resumes/new",
    title: "Resume / CV",
    subtitle: "ATS-friendly resume, built as you chat.",
    icon: FileText,
  },
  {
    href: "/dashboard/letters/new",
    title: "Cover Letter",
    subtitle: "Persuasive letter for a specific role.",
    icon: Mail,
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
                  className="db-option-row"
                >
                  <span className="db-option-row__icon">
                    <option.icon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="db-option-row__title">{option.title}</span>
                    <span className="db-option-row__sub">
                      {option.subtitle}
                    </span>
                  </span>
                  <ChevronRight className="db-option-row__chevron" />
                </button>
              ))}
            </div>
          </DialogPanel>
        </DialogPortal>
      </Dialog>
    </>
  );
}