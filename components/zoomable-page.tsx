"use client";

import { useLayoutEffect, useRef, useState } from "react";

export const PAGE_WIDTH = 640;
export const PAGE_RATIO = 210 / 297;
export const US_LETTER_RATIO = 8.5 / 11;

export function ZoomablePage({
  zoom,
  pageRatio = PAGE_RATIO,
  children,
}: {
  zoom: number;
  pageRatio?: number;
  children: React.ReactNode;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [naturalHeight, setNaturalHeight] = useState(PAGE_WIDTH * pageRatio);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const update = () => setNaturalHeight(el.offsetHeight);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="mx-auto"
      style={{ width: PAGE_WIDTH * zoom, height: naturalHeight * zoom }}
    >
      <div
        ref={innerRef}
        className="origin-top-left"
        style={{ width: PAGE_WIDTH, transform: `scale(${zoom})` }}
      >
        {children}
      </div>
    </div>
  );
}