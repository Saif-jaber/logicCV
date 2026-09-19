"use client";

import {
  Check,
  Download,
  Minus,
  Plus,
  RotateCw,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LetterPreview } from "@/components/letter/letter-preview";
import { Paginated } from "@/components/paginated";
import { ZoomablePage, PAGE_WIDTH } from "@/components/zoomable-page";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  beginLetterConversation,
  stepLetter,
  type LetterStage,
  type LetterPending,
} from "@/lib/letter-ai";
import { computeLetterScore, type Letter } from "@/lib/letter";
import { downloadPdf } from "@/lib/pdf";
import { saveLetterAction } from "@/app/actions/documents";
import { LetterPdf } from "@/components/pdf/letter-pdf";
import { uid } from "@/lib/resume";
import { AiStepError } from "@/lib/ai";
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

function createInitialState(initialLetter: Letter): BuilderState {
  const { result, stepIndex } = beginLetterConversation();
  return {
    messages: [{ id: uid(), role: "ai", text: result.message }],
    letter: initialLetter,
    stepIndex,
    stage: result.stage,
    pending: result.pending,
    suggestions: ["A cover letter", "An application letter"],
  };
}

export function LetterBuilder({
  docId,
  initialName,
  initialLetter,
}: {
  docId: string;
  initialName: string;
  initialLetter: Letter;
}) {
  const [state, setState] = useState<BuilderState>(() =>
    createInitialState(initialLetter)
  );
  const [name, setName] = useState(initialName);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">(
    "saved"
  );
  const firstRender = useRef(true);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [failed, setFailed] = useState<{ text: string; detail: string } | null>(
    null
  );
  const lastUserTextRef = useRef("");
  const autoRetriedRef = useRef(false);
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

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSaveStatus("saving");
    const timer = window.setTimeout(() => {
      saveLetterAction(
        docId,
        name.trim() === "" ? "Untitled Letter" : name,
        state.letter
      )
        .then(() => setSaveStatus("saved"))
        .catch(() => setSaveStatus("error"));
    }, 600);
    return () => window.clearTimeout(timer);
  }, [docId, name, state.letter]);

  async function requestAssistant(text: string) {
    setTyping(true);
    setFailed(null);

    const alreadyLast =
      state.messages.length > 0 &&
      state.messages[state.messages.length - 1].role === "user" &&
      state.messages[state.messages.length - 1].text === text;
    const history = alreadyLast
      ? state.messages
      : [...state.messages, { role: "user" as const, text }];

    try {
      const { result } = await stepLetter({
        messages: history,
        letter: state.letter,
        stage: state.stage,
      });
      setState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { id: uid(), role: "ai" as const, text: result.message },
        ],
        letter: result.letter,
        stage: result.stage,
        pending: result.pending,
        suggestions: result.suggestions,
      }));
    } catch (error) {
      const retryable = error instanceof AiStepError ? error.retryable : false;
      const detail =
        error instanceof Error
          ? error.message
          : "Something went wrong contacting the AI.";
      setFailed({ text, detail });
      if (retryable && !autoRetriedRef.current) {
        autoRetriedRef.current = true;
        window.setTimeout(() => {
          if (lastUserTextRef.current === text) void requestAssistant(text);
        }, 2500);
      }
    } finally {
      setTyping(false);
    }
  }

  function send(raw?: string) {
    const text = (raw ?? input).trim();
    if (text === "" || typing) return;
    setInput("");
    autoRetriedRef.current = false;
    lastUserTextRef.current = text;
    setState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        { id: uid(), role: "user" as const, text },
      ],
    }));
    void requestAssistant(text);
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
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="db-kicker">Letter</span>
          <div className="mt-1 flex flex-wrap items-center gap-2.5">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Untitled Letter"
              aria-label="Letter name"
              className="db-composer__field h-8 w-52 flex-none rounded-lg px-3"
            />
            <span
              className={cn(
                "font-code text-xs",
                saveStatus === "error"
                  ? "text-destructive"
                  : "text-muted-foreground"
              )}
            >
              {saveStatus === "saving"
                ? "saving…"
                : saveStatus === "error"
                  ? "failed to save"
                  : "saved"}
            </span>
          </div>
        </div>
        <Link
          href="/dashboard/letters"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "db-section-link")}
        >
          My Letters
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-6 lg:h-[calc(100dvh-8rem)]">
        <section
          aria-label="Chat with the letter assistant"
          className="db-panel h-[50dvh] min-h-[320px] sm:h-[60dvh] sm:min-h-[400px] lg:h-full"
        >
          <div className="db-panel__head">
            <div className="flex items-center gap-2.5">
              <span className="db-assistant">
                <Sparkles className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="db-panel__title">LogicCV Assistant</p>
                <p className="db-panel__meta">AI assistant · free-form chat</p>
              </div>
            </div>
          </div>

          <div className="db-chat-scroll" aria-live="polite">
            {state.messages.map((message) =>
              message.role === "user" ? (
                <div key={message.id} className="db-bubble-user">
                  {message.text}
                </div>
              ) : (
                <div key={message.id} className="db-bubble-ai">
                  <span className="db-assistant mt-0.5 h-7 w-7">
                    <Sparkles className="size-3.5" />
                  </span>
                  <div className="db-bubble-body">{message.text}</div>
                </div>
              )
            )}

            {failed && !typing && (
              <div className="db-bubble-ai">
                <span className="db-assistant mt-0.5 h-7 w-7 bg-danger text-paper">
                  <X className="size-3.5" />
                </span>
                <div className="flex min-w-0 flex-col items-start gap-2">
                  <div className="db-bubble-body mb-2 border-danger/30 text-danger">
                    {failed.detail}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void requestAssistant(failed.text)}
                    className="db-section-link"
                  >
                    <RotateCw className="size-3.5" />
                    Try again
                  </Button>
                </div>
              </div>
            )}

            {typing && (
              <div className="db-bubble-ai">
                <span className="db-assistant mt-0.5 h-7 w-7">
                  <Sparkles className="size-3.5" />
                </span>
                <div
                  className="flex items-center gap-1 rounded-2xl border border-rule bg-paper px-4 py-3"
                  aria-label="Assistant is typing"
                >
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="size-1.5 animate-bounce rounded-full bg-cobalt"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="db-composer">
            <div className="flex flex-1 flex-col gap-2">
              {state.suggestions.length > 0 && (
                <div className="-mb-2 flex items-center gap-1.5 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible">
                  {state.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      disabled={typing}
                      onClick={() => void send(suggestion)}
                      className="db-suggestion"
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
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message the assistant..."
                  aria-label="Message the assistant"
                  className="db-composer__field"
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
          </div>
        </section>

        <section
          aria-label="Live letter preview"
          className="db-panel h-[50dvh] min-h-[320px] sm:h-[60dvh] sm:min-h-[400px] lg:h-auto"
        >
          <div className="db-panel__head">
            <div className="flex items-center gap-2">
              <span className="db-score">{quality.score}</span>
              <span className="db-score--label">/100 quality</span>
              <span
                className={cn(
                  "db-chip",
                  quality.score >= 80
                    ? "db-chip--good"
                    : quality.score >= 50
                      ? "db-chip--mid"
                      : "db-chip--low"
                )}
              >
                {quality.score >= 80
                  ? "Strong"
                  : quality.score >= 50
                    ? "Improving"
                    : "Needs work"}
              </span>
              <button
                type="button"
                onClick={handleExport}
                title="Download as PDF"
                aria-label="Download as PDF"
                className="db-icon-btn ml-1"
              >
                <Download className="size-4" />
              </button>
            </div>
            <div className="db-zoom-ctrl">
              <button
                type="button"
                onClick={() => {
                  userAdjusted.current = true;
                  setZoom((z) => Math.max(0.3, +(z - 0.1).toFixed(2)));
                }}
                aria-label="Zoom out"
                className="db-zoom-btn"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="db-zoom-value">{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                onClick={() => {
                  userAdjusted.current = true;
                  setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)));
                }}
                aria-label="Zoom in"
                className="db-zoom-btn"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>

          <div ref={previewScrollRef} className="db-preview-scroll">
            <ZoomablePage zoom={zoom}>
              <Paginated>
                <LetterPreview letter={state.letter} />
              </Paginated>
            </ZoomablePage>
          </div>

          <div className="border-t border-rule px-4 py-3">
            <p className="db-panel__title">Quality checklist</p>
            <ul className="db-checklist mt-2">
              {quality.checks.map((check) => (
                <li
                  key={check.label}
                  className={cn(
                    "db-check",
                    check.ok ? "db-check--ok" : "db-check--no"
                  )}
                >
                  {check.ok ? (
                    <Check className="size-3.5" />
                  ) : (
                    <X className="size-3.5" />
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