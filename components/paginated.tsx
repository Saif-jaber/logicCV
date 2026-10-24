"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { PAGE_RATIO, PAGE_WIDTH } from "@/components/zoomable-page";

export function PageBlock({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

const SHADOW =
  "shadow-[0_1px_2px_rgba(2,6,23,0.06),0_12px_24px_-8px_rgba(2,6,23,0.16),0_28px_56px_-16px_rgba(2,6,23,0.22)]";

export function Paginated({
  children,
  pageRatio = PAGE_RATIO,
  marginX = 40,
  marginY = 40,
}: {
  children: ReactNode;
  pageRatio?: number;
  marginX?: number;
  marginY?: number;
}) {
  const pageHeight = PAGE_WIDTH / pageRatio;
  const contentHeight = pageHeight - marginY * 2;
  const contentWidth = PAGE_WIDTH - marginX * 2;
  const columnsRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  useLayoutEffect(() => {
    const el = columnsRef.current;
    if (!el) return;

    const update = () => {
      const count = Math.max(
        1,
        Math.ceil((el.scrollWidth - 1) / contentWidth)
      );
      setPageCount((prev) => (prev === count ? prev : count));
    };

    const frame = () => requestAnimationFrame(update);
    frame();

    const observer = new ResizeObserver(frame);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children, contentHeight, contentWidth]);

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 opacity-0"
        style={{ width: contentWidth }}
      >
        <div
          ref={columnsRef}
          style={{
            height: contentHeight,
            columnWidth: contentWidth,
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
          style={{ height: pageHeight }}
        >
          <div
            className="overflow-hidden"
            style={{
              position: "absolute",
              top: marginY,
              left: marginX,
              width: contentWidth,
              height: contentHeight,
            }}
          >
            <div
              style={{
                height: contentHeight,
                columnWidth: contentWidth,
                columnGap: 0,
                columnFill: "auto",
                transform: `translateX(-${i * contentWidth}px)`,
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