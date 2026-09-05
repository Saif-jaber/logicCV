"use client";

import {
  ArrowLeft,
  Check,
  FileText,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ResumePreview } from "@/components/resume/resume-preview";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  beginConversation,
  step,
  type AiStage,
  type PendingAction,
} from "@/lib/mock-ai";
import { computeAts, uid, type Resume } from "@/lib/resume";
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

function createInitialState(): BuilderState {
  const { result, stepIndex } = beginConversation();
  return {
    messages: [{ id: uid(), role: "ai", text: result.message }],
    resume: result.resume,
    stepIndex,
    stage: result.stage,
    pending: result.pending,
    suggestions: result.suggestions,
  };
}

export function ResumeBuilder() {
  const [state, setState] = useState<BuilderState>(createInitialState);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const ats = computeAts(state.resume);

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

  function handleExport() {
    setTyping(true);
    window.setTimeout(() => {
      setState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: uid(),
            role: "ai",
            text: "PDF export goes live once the backend is connected. For now your resume is saved in the app. Keep chatting to perfect it!",
          },
        ],
      }));
      setTyping(false);
    }, 650);
  }

  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">
              Resume Builder
            </h1>
            <Badge
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                ats.score >= 80
                  ? "bg-emerald-100 text-emerald-700"
                  : ats.score >= 50
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-600"
              )}
            >
              ATS {ats.score}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Talk to the AI assistant. It writes an ATS-friendly CV as you go.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/resumes"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "rounded-full text-muted-foreground"
            )}
          >
            <ArrowLeft className="size-4" />
            My Resumes
          </Link>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={handleExport}
          >
            <FileText className="size-4" />
            Export PDF
          </Button>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <section
          aria-label="Chat with the resume assistant"
          className="flex h-[68vh] min-h-[480px] flex-col overflow-hidden rounded-2xl border border-border bg-card lg:h-[calc(100vh-9rem)]"
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
          className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Live Preview
              </p>
              <p className="text-xs text-muted-foreground">
                Updates as you chat &middot; ATS-safe layout
              </p>
            </div>
            <div className="ml-4 flex items-baseline gap-1 text-right">
              <span className="text-2xl font-bold text-foreground">
                {ats.score}
              </span>
              <span className="text-[11px] text-muted-foreground">
                /100 · ATS
              </span>
            </div>
          </div>

          <div className="max-h-[480px] flex-1 overflow-y-auto bg-muted/40 p-3 sm:p-6 lg:max-h-none">
            <ResumePreview resume={state.resume} />
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