"use client";

import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "./use-in-view";

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <Tag
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
    </Tag>
  );
}