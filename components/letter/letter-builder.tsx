"use client";

import {
  ArrowLeft,
  Check,
  Download,
  Minus,
  Plus,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LetterPreview } from "@/components/letter/letter-preview";
import { Paginated } from "@/components/paginated";
import { ZoomablePage, PAGE_WIDTH } from "@/components/zoomable-page";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  beginLetterConversation,
  stepLetter,
  type LetterStage,
  type LetterPending,
} from "@/lib/mock-letter-ai";
import { computeLetterScore, type Letter } from "@/lib/letter";
import { downloadPdf } from "@/lib/pdf";
import { LetterPdf } from "@/components/pdf/letter-pdf";
import { uid } from "@/lib/resume";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
};

type BuilderState = {
  messages: ChatMessage[];
  letter: Letter;
  stepIndex: number;
  stage: LetterStage;
  pending: LetterPending | null;
  suggestions: string[];
};

function createInitialState(): BuilderState {
  const { result, stepIndex } = beginLetterConversation();
  return {
    messages: [{ id: uid(), role: "ai", text: result.message }],
    letter: result.letter,
    stepIndex,
    stage: result.stage,
    pending: result.pending,
    suggestions: ["A cover letter", "An application letter"],
  };
}

export function LetterBuilder() {
  const [state, setState] = useState<BuilderState>(createInitialState);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const userAdjusted = useRef(false);

  const quality = computeLetterScore(state.letter);

  useLayoutEffect(() => {
    const container = previewScrollRef.current;
    if (!container) return;

    const fit = () => {
      if (userAdjusted.current) return;
      const f = Math.min(container.clientWidth, PAGE_WIDTH) / PAGE_WIDTH;
      if (f > 0.3) {
        setZoom(Math.min(1, f));
      }
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [state.messages, typing]);

  function send(raw?: string) {
    const text = (raw ?? input).trim();
    if (text === "" || typing) return;
    setInput("");
    setTyping(true);

    setState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        { id: uid(), role: "user" as const, text },
      ],
    }));

    window.setTimeout(() => {
      setState((prev) => {
        const { result, stepIndex } = stepLetter({
          input: text,
          letter: prev.letter,
          stage: prev.stage,
          stepIndex: prev.stepIndex,
          pending: prev.pending,
        });
        return {
          ...prev,
          messages: [
            ...prev.messages,
            { id: uid(), role: "ai" as const, text: result.message },
          ],
          letter: result.letter,
          stepIndex,
          stage: result.stage,
          pending: result.pending,
          suggestions: result.suggestions,
        };
      });
      setTyping(false);
    }, 750);
  }

  async function handleExport() {
    const name =
      state.letter.kind === "application"
        ? "application-letter.pdf"
        : "cover-letter.pdf";
    await downloadPdf(<LetterPdf letter={state.letter} />, name);
  }

  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">
              Letter Builder
            </h1>
            <Badge
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                quality.score >= 80
                  ? "bg-emerald-100 text-emerald-700"
                  : quality.score >= 50
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-600"
              )}
            >
              Quality {quality.score}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Talk to the AI assistant. It writes a persuasive cover letter as you go.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/letters"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "rounded-full text-muted-foreground"
            )}
          >
            <ArrowLeft className="size-4" />
            My Letters
          </Link>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-6 lg:h-[calc(100dvh-9rem)]">
        <section
          aria-label="Chat with the letter assistant"
          className="flex h-[50dvh] min-h-[320px] sm:h-[60dvh] sm:min-h-[400px] flex-col overflow-hidden rounded-2xl border border-border bg-card lg:h-full"
        >
          <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-700 text-primary-foreground shadow-sm">
              <Sparkles className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                LogicCV Assistant
              </p>
              <p className="text-xs text-muted-foreground">
                Mock AI &middot; free-form chat
              </p>
            </div>
          </div>

          <div
            className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
            aria-live="polite"
          >
            {state.messages.map((message) =>
              message.role === "user" ? (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground">
                    {message.text}
                  </div>
                </div>
              ) : (
                <div key={message.id} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-700 text-primary-foreground">
                    <Sparkles className="size-3.5" />
                  </span>
                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2 text-sm leading-relaxed text-foreground">
                    {message.text}
                  </div>
                </div>
              )
            )}

            {typing && (
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-700 text-primary-foreground">
                  <Sparkles className="size-3.5" />
                </span>
                <div
                  className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-4 py-3"
                  aria-label="Assistant is typing"
                >
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border p-3">
            {state.suggestions.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {state.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    disabled={typing}
                    onClick={() => void send(suggestion)}
                    className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message the assistant..."
                aria-label="Message the assistant"
                className="h-9 flex-1 rounded-full border-border bg-muted/50 px-4"
              />
              <Button
                type="submit"
                size="icon"
                disabled={typing || input.trim() === ""}
                aria-label="Send message"
                className="size-9 shrink-0 rounded-full"
              >
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </section>

<section
          aria-label="Live letter preview"
          className="flex h-[50dvh] min-h-[320px] sm:h-[60dvh] sm:min-h-[400px] min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card lg:h-auto"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">
                {quality.score}
              </span>
              <span className="text-[11px] text-muted-foreground">
                /100 quality
              </span>
              <button
                type="button"
                onClick={handleExport}
                title="Download as PDF"
                aria-label="Download as PDF"
                className="ml-1 inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Download className="size-4" />
              </button>
            </div>
            <div className="flex items-center gap-1 rounded-full border border-border bg-muted/50 p-0.5">
              <button
                type="button"
                onClick={() => {
                  userAdjusted.current = true;
                  setZoom((z) => Math.max(0.3, +(z - 0.1).toFixed(2)));
                }}
                aria-label="Zoom out"
                className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-10 text-center text-xs font-medium text-foreground tabular-nums">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => {
                  userAdjusted.current = true;
                  setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)));
                }}
                aria-label="Zoom in"
                className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>

          <div
            ref={previewScrollRef}
            className="min-h-[320px] flex-1 overflow-auto bg-muted/60 bg-[radial-gradient(circle,rgba(2,6,23,0.08)_1px,transparent_1px)] bg-[size:14px_14px] p-4"
          >
            <ZoomablePage zoom={zoom}>
              <Paginated>
                <LetterPreview letter={state.letter} />
              </Paginated>
            </ZoomablePage>
          </div>

          <div className="border-t border-border px-4 py-3">
            <p className="text-xs font-semibold text-foreground">
              Quality checklist
            </p>
            <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {quality.checks.map((check) => (
                <li
                  key={check.label}
                  className={cn(
                    "flex items-center gap-2 text-xs",
                    check.ok ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {check.ok ? (
                    <Check className="size-3.5 shrink-0 text-emerald-600" />
                  ) : (
                    <X className="size-3.5 shrink-0 text-gray-400" />
                  )}
                  {check.label}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}