"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { PAGE_RATIO, PAGE_WIDTH } from "@/components/zoomable-page";

export const PAGE_HEIGHT = PAGE_WIDTH / PAGE_RATIO;

// White margin around the content on each page, mirroring the PDF export.
export const PAGE_MARGIN = 40;

export const CONTENT_HEIGHT = PAGE_HEIGHT - PAGE_MARGIN * 2;
export const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;

export function PageBlock({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

const SHADOW =
  "shadow-[0_1px_2px_rgba(2,6,23,0.06),0_12px_24px_-8px_rgba(2,6,23,0.16),0_28px_56px_-16px_rgba(2,6,23,0.22)]";

export function Paginated({ children }: { children: ReactNode }) {
  const columnsRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  useLayoutEffect(() => {
    const el = columnsRef.current;
    if (!el) return;

    const update = () => {
      const count = Math.max(1, Math.ceil((el.scrollWidth - 1) / CONTENT_WIDTH));
      setPageCount((prev) => (prev === count ? prev : count));
    };

    const frame = () => requestAnimationFrame(update);
    frame();

    const observer = new ResizeObserver(frame);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children]);

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 opacity-0"
        style={{ width: CONTENT_WIDTH }}
      >
        <div
          ref={columnsRef}
          style={{
            height: CONTENT_HEIGHT,
            columnWidth: CONTENT_WIDTH,
            columnGap: 0,
            columnFill: "auto",
          }}
        >
          {children}
        </div>
      </div>

      {Array.from({ length: pageCount }, (_, i) => (
        <div
          key={i}
          data-page
          className={`relative w-full max-w-[640px] overflow-hidden bg-white ring-1 ring-black/5 ${SHADOW}`}
          style={{ height: PAGE_HEIGHT }}
        >
          <div
            className="overflow-hidden"
            style={{
              position: "absolute",
              top: PAGE_MARGIN,
              left: PAGE_MARGIN,
              width: CONTENT_WIDTH,
              height: CONTENT_HEIGHT,
            }}
          >
            <div
              style={{
                height: CONTENT_HEIGHT,
                columnWidth: CONTENT_WIDTH,
                columnGap: 0,
                columnFill: "auto",
                transform: `translateX(-${i * CONTENT_WIDTH}px)`,
              }}
            >
              {children}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}