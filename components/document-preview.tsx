"use client";

import { useLayoutEffect, useRef, useState } from "react";

export function DocumentPreview({
  pageWidth = 560,
  children,
}: {
  pageWidth?: number;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.28);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => setScale(el.clientWidth / pageWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [pageWidth]);

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full flex-col items-start overflow-hidden bg-white"
      aria-hidden="true"
    >
      <div
        style={{ width: pageWidth, transform: `scale(${scale})` }}
        className="pointer-events-none origin-top-left"
      >
        {children}
      </div>
    </div>
  );
}