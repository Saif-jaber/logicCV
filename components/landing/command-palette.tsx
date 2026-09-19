"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
} from "react";
import { ArrowRight, Command, LayoutGrid, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthModal } from "./auth-modal";

type CmdkItem = {
  id: string;
  label: string;
  hint?: string;
  icon: ElementType;
  section: string;
  onSelect: () => void;
};

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function scrollToSection(id: string) {
  const el = document.querySelector<HTMLElement>(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  else window.location.hash = id;
}

function useCommandList() {
  const { open } = useAuthModal();
  return useMemo<CmdkItem[]>(
    () => [
      {
        id: "go-how",
        label: "How it works",
        hint: "Go to section",
        icon: LayoutGrid,
        section: "Navigate",
        onSelect: () => scrollToSection("#how-it-works"),
      },
      {
        id: "go-features",
        label: "Features",
        hint: "Go to section",
        icon: LayoutGrid,
        section: "Navigate",
        onSelect: () => scrollToSection("#features"),
      },
      {
        id: "go-love",
        label: "Wall of love",
        hint: "Go to section",
        icon: LayoutGrid,
        section: "Navigate",
        onSelect: () => scrollToSection("#wall-of-love"),
      },
      {
        id: "act-signup",
        label: "Build with AI",
        hint: "Sign up free",
        icon: Sparkles,
        section: "Actions",
        onSelect: () => open("signup", "/dashboard/resumes/new"),
      },
      {
        id: "act-signin",
        label: "Explore the app",
        hint: "Sign in",
        icon: ArrowRight,
        section: "Actions",
        onSelect: () => open("signin", "/dashboard"),
      },
    ],
    [open]
  );
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const items = useCommandList();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => i.label.toLowerCase().includes(q)) : items;
  }, [query, items]);

  const handleSelect = useCallback(
    (item: CmdkItem) => {
      onOpenChange(false);
      item.onSelect();
    },
    [onOpenChange]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onOpenChange(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % Math.max(filtered.length, 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) =>
        Math.max(i - 1 + Math.max(filtered.length, 1), 0) %
        Math.max(filtered.length, 1)
      );
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) handleSelect(item);
    }
  };

  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-cmdk-index="${activeIndex}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  if (!open) return null;

  const activeItem = filtered[activeIndex];

  const sections: Array<{ name: string; items: CmdkItem[] }> = [];
  for (const item of filtered) {
    const last = sections[sections.length - 1];
    if (last && last.name === item.section) last.items.push(item);
    else sections.push({ name: item.section, items: [item] });
  }

  let offset = 0;

  return (
    <div
      className="lp-cmdk"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onKeyDown={onKeyDown}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div
        className="lp-cmdk__panel animate-in fade-in zoom-in-95 ease-out fill-mode-both"
        style={{ animationDuration: "200ms" }}
      >
        <div className="lp-cmdk__input">
          <Search className="size-4 shrink-0 text-ink-2" aria-hidden />
          <input
            ref={inputRef}
            className="lp-cmdk__field lp-focus"
            placeholder="Type to jump…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            aria-label="Search commands"
          />
          <kbd className="lp-search__kbd shrink-0">
            <Command className="size-3" aria-hidden />K
          </kbd>
        </div>

        <div ref={listRef} className="lp-cmdk__list">
          {filtered.length === 0 && (
            <p className="px-4 py-8 text-center font-code text-xs text-ink-2">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {sections.map((section) => (
            <div key={section.name}>
              <p className="lp-cmdk__group-label">{section.name}</p>
              {section.items.map((item) => {
                const index = offset++;
                const isActive = activeItem === item;
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-cmdk-index={index}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => handleSelect(item)}
                    className={cn(
                      "lp-cmdk__item lp-focus",
                      isActive && "is-active"
                    )}
                  >
                    <item.icon className="size-4 shrink-0 text-cobalt" aria-hidden />
                    <span className="truncate">{item.label}</span>
                    <span className="lp-cmdk__item-hint">{item.hint}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-rule px-4 py-2 font-code text-xs text-ink-2">
          <span>↑ ↓ navigate · enter select · esc close</span>
        </div>
      </div>
    </div>
  );
}