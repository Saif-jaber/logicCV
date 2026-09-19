import { emptyResume, type Resume } from "@/lib/resume";
import { AiStepError } from "@/lib/ai";

export type AiStage = "onboarding" | "chat";

export type PendingAction = "summary" | "experience" | "skills" | "project";

export type AiMessage = { role: "user" | "ai"; text: string };

export interface AiResult {
  message: string;
  resume: Resume;
  stage: AiStage;
  pending: PendingAction | null;
  suggestions: string[];
}

export interface MockStepInput {
  messages: AiMessage[];
  resume: Resume;
  stage: AiStage;
}

export interface MockStepOutput {
  result: AiResult;
  stepIndex: number;
}

export const chatSuggestions = [
  "Add my skills",
  "Rewrite my summary",
  "Add a project",
  "Run ATS check",
];

export function beginConversation(): MockStepOutput {
  return {
    result: {
      message:
        'Hi, I\'m your LogicCV assistant. Answer a few quick questions and I\'ll build an ATS-friendly resume as we chat. Let\'s start: what\'s your full name and job title? (e.g. "Joel Koyoo, Frontend Developer")',
      resume: JSON.parse(JSON.stringify(emptyResume)),
      stage: "onboarding",
      pending: null,
      suggestions: [],
    },
    stepIndex: 0,
  };
}

export async function step(input: MockStepInput): Promise<MockStepOutput> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "resume",
      stage: input.stage,
      messages: input.messages,
      document: input.resume,
    }),
  });

  if (!res.ok) {
    let detail = "resume AI request failed";
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
    document: Resume;
    stage: AiStage;
    pending: PendingAction | null;
    suggestions: string[];
  } = await res.json();

  return {
    result: {
      message: data.message,
      resume: data.document,
      stage: data.stage,
      pending: data.pending,
      suggestions: data.suggestions,
    },
    stepIndex: 0,
  };
}