"use client";

import {
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
import { ResumePreview } from "@/components/resume/resume-preview";
import { Paginated } from "@/components/paginated";
import { ZoomablePage, PAGE_WIDTH } from "@/components/zoomable-page";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  beginConversation,
  step,
  type AiStage,
  type PendingAction,
} from "@/lib/resume-ai";
import { computeAts, uid, type Resume } from "@/lib/resume";
import { downloadPdf } from "@/lib/pdf";
import { saveResumeAction } from "@/app/actions/documents";
import { ResumePdf } from "@/components/pdf/resume-pdf";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
};

type BuilderState = {
  messages: ChatMessage[];
  resume: Resume;
  stepIndex: number;
  stage: AiStage;
  pending: PendingAction | null;
  suggestions: string[];
};

function createInitialState(
  initialName: string,
  initialResume: Resume
): BuilderState {
  const { result, stepIndex } = beginConversation();
  return {
    messages: [{ id: uid(), role: "ai", text: result.message }],
    resume: initialResume,
    stepIndex,
    stage: result.stage,
    pending: result.pending,
    suggestions: result.suggestions,
  };
}

export function ResumeBuilder({
  docId,
  initialName,
  initialResume,
}: {
  docId: string;
  initialName: string;
  initialResume: Resume;
}) {
  const [state, setState] = useState<BuilderState>(() =>
    createInitialState(initialName, initialResume)
  );
  const [name, setName] = useState(initialName);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">(
    "saved"
  );
  const firstRender = useRef(true);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const userAdjusted = useRef(false);

  const ats = computeAts(state.resume);

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

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSaveStatus("saving");
    const timer = window.setTimeout(() => {
      saveResumeAction(
        docId,
        name.trim() === "" ? "Untitled Resume" : name,
        state.resume
      )
        .then(() => setSaveStatus("saved"))
        .catch(() => setSaveStatus("error"));
    }, 600);
    return () => window.clearTimeout(timer);
  }, [docId, name, state.resume]);

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
        const { result, stepIndex } = step({
          input: text,
          resume: prev.resume,
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
          resume: result.resume,
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
    await downloadPdf(<ResumePdf resume={state.resume} />, "resume.pdf");
  }

  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Untitled Resume"
            aria-label="Resume name"
            className="h-9 w-56 rounded-full border-border bg-card px-4"
          />
          <span
            className={cn(
              "text-xs",
              saveStatus === "error"
                ? "text-red-500"
                : "text-muted-foreground"
            )}
          >
            {saveStatus === "saving"
              ? "Saving..."
              : saveStatus === "error"
                ? "Failed to save"
                : "Saved"}
          </span>
        </div>
        <Link
          href="/dashboard/resumes"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-full text-muted-foreground")}
        >
          My Resumes
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-6 lg:h-[calc(100dvh-8rem)]">
        <section
          aria-label="Chat with the resume assistant"
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
                AI assistant &middot; free-form chat
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
            {state.stage === "chat" && (
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
          aria-label="Live resume preview"
          className="flex h-[50dvh] min-h-[320px] sm:h-[60dvh] sm:min-h-[400px] min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card lg:h-auto"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">
                {ats.score}
              </span>
              <span className="text-[11px] text-muted-foreground">/100 ATS</span>
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
                <ResumePreview resume={state.resume} />
              </Paginated>
            </ZoomablePage>
          </div>

          <div className="border-t border-border px-4 py-3">
            <p className="text-xs font-semibold text-foreground">
              ATS checklist
            </p>
            <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {ats.checks.map((check) => (
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