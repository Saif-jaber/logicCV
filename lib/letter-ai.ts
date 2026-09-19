import { emptyLetter, type Letter } from "@/lib/letter";
import { AiStepError } from "@/lib/ai";

export type LetterStage = "onboarding" | "chat";

export type LetterPending = "highlight";

export type LetterAiMessage = { role: "user" | "ai"; text: string };

export interface LetterAiResult {
  message: string;
  letter: Letter;
  stage: LetterStage;
  pending: LetterPending | null;
  suggestions: string[];
}

export interface LetterStepInput {
  messages: LetterAiMessage[];
  letter: Letter;
  stage: LetterStage;
}

export interface LetterStepOutput {
  result: LetterAiResult;
  stepIndex: number;
}

export const letterChatSuggestions = [
  "Make it warmer",
  "Add a highlight",
  "Tighten the letter",
  "Check letter quality",
];

export function beginLetterConversation(): LetterStepOutput {
  return {
    result: {
      message:
        'Hi, I\'m your LogicCV assistant. What would you like to write today? A cover letter for a specific role, or an application letter showing interest in a company? (Type "cover letter" or "application letter")',
      letter: JSON.parse(JSON.stringify(emptyLetter)),
      stage: "onboarding",
      pending: null,
      suggestions: [],
    },
    stepIndex: 0,
  };
}

export async function stepLetter(
  input: LetterStepInput
): Promise<LetterStepOutput> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "letter",
      stage: input.stage,
      messages: input.messages,
      document: input.letter,
    }),
  });

  if (!res.ok) {
    let detail = "letter AI request failed";
    let retryable = false;
    try {
      const body = await res.json();
      if (body && typeof body.error === "string") detail = body.error;
      if (body && typeof body.retryable === "boolean") retryable = body.retryable;
    } catch {}
    throw new AiStepError(detail, res.status, retryable);
  }

  const data: {
    message: string;
    document: Letter;
    stage: LetterStage;
    pending: LetterPending | null;
    suggestions: string[];
  } = await res.json();

  return {
    result: {
      message: data.message,
      letter: data.document,
      stage: data.stage,
      pending: data.pending,
      suggestions: data.suggestions,
    },
    stepIndex: 0,
  };
}