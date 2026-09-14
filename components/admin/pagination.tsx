"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageItem = number | "ellipsis-start" | "ellipsis-end";

function getPageItems(page: number, pageCount: number): PageItem[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  const items: PageItem[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);
  if (start > 2) items.push("ellipsis-start");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < pageCount - 1) items.push("ellipsis-end");
  items.push(pageCount);
  return items;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;

  const items = getPageItems(page, pageCount);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-3 border-t border-border pt-4"
    >
      <p className="text-xs text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span> of{" "}
        <span className="font-medium text-foreground">{pageCount}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-full"
        >
          <ChevronLeft />
          <span className="sr-only sm:not-sr-only">Previous</span>
        </Button>
        <div className="flex items-center gap-1">
          {items.map((item, index) =>
            typeof item === "number" ? (
              <Button
                key={item}
                variant={item === page ? "default" : "ghost"}
                size="sm"
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                onClick={() => onPageChange(item)}
                className={cn("size-8 rounded-full p-0", item === page && "font-semibold")}
              >
                {item}
              </Button>
            ) : (
              <span
                key={`${item}-${index}`}
                aria-hidden="true"
                className="flex size-8 items-center justify-center text-muted-foreground"
              >
                &hellip;
              </span>
            )
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="rounded-full"
        >
          <span className="sr-only sm:not-sr-only">Next</span>
          <ChevronRight />
        </Button>
      </div>
    </nav>
  );
}