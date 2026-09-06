import { cn } from "@/lib/utils";

export function A4Page({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-[210/297] w-full max-w-[640px] bg-white",
        "ring-1 ring-black/5",
        "shadow-[0_1px_2px_rgba(2,6,23,0.06),0_12px_24px_-8px_rgba(2,6,23,0.16),0_28px_56px_-16px_rgba(2,6,23,0.22)]",
        className
      )}
    >
      {children}
    </div>
  );
}