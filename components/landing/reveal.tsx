"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "./use-in-view";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        inView
          ? "animate-in fade-in slide-in-from-bottom-4 ease-out fill-mode-both"
          : "opacity-0",
        className
      )}
      style={
        inView
          ? { animationDuration: "700ms", animationDelay: `${delay}ms` }
          : undefined
      }
    >
      {children}
    </div>
  );
}