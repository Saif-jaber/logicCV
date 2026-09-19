import { NextResponse } from "next/server";
import { APICallError, generateObject, type GenerateObjectResult } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";

/* ── Document schemas ─────────────────────────────────────────────── */

const resumeDocumentSchema = z.object({
  name: z.string(),
  title: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  summary: z.string(),
  experience: z.array(
    z.object({
      id: z.string(),
      role: z.string(),
      company: z.string(),
      period: z.string(),
      bullets: z.array(z.string()),
    })
  ),
  education: z.array(
    z.object({
      id: z.string(),
      degree: z.string(),
      school: z.string(),
      period: z.string(),
    })
  ),
  skills: z.array(z.string()),
  projects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
    })
  ),
});

const letterDocumentSchema = z.object({
  kind: z.enum(["cover", "application"]),
  senderName: z.string(),
  senderTitle: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  company: z.string(),
  role: z.string(),
  recipientName: z.string(),
  achievements: z.array(z.string()),
  body: z.array(z.string()),
  valediction: z.string(),
  reason: z.string(),
});

const resumeOutputSchema = z.object({
  message: z.string(),
  stage: z.enum(["onboarding", "chat"]),
  document: resumeDocumentSchema,
  pending: z
    .enum(["summary", "experience", "skills", "project"])
    .nullable(),
  suggestions: z.array(z.string()),
});

const letterOutputSchema = z.object({
  message: z.string(),
  stage: z.enum(["onboarding", "chat"]),
  document: letterDocumentSchema,
  pending: z.enum(["highlight"]).nullable(),
  suggestions: z.array(z.string()),
});

/* ── System prompts ──────────────────────────────────────────────── */

const resumeSystem = `You are the LogicCV resume assistant. The user writes conversational answers and edit requests; you maintain their resume document.

The current document is included at the end in JSON. Return the FULL updated document every turn, keeping all previous information and ids, and only adding short new ids (like "e1", "sk2") when creating new entries.

Resume JSON shape: { name, title, email, phone, location, summary, experience: [{ id, role, company, period, bullets: [string] }], education: [{ id, degree, school, period }], skills: [string], projects: [{ id, name, description }] }

Rules:
- Stay in "onboarding" until the user has provided name + title, contact, a summary, at least one experience role with achievement bullets, education, and skills. Then switch to "chat".
- During onboarding, capture facts as given. In chat mode, improve wording only when the user asks (strong verbs, concise, ATS-friendly); never invent facts.
- "pending" is null unless you asked the user to paste one of: a summary, experience, skills, or a project ("summary" | "experience" | "skills" | "project") and are waiting for that input.
- "suggestions" must be exactly 4 short example follow-ups the user could type.
- Never use em dashes (—) or en dashes (–). Use commas, periods, or plain hyphens instead.
- Respond in the same language as the user.`;

const letterSystem = `You are the LogicCV letter editor. The user writes conversational answers and edit requests; you maintain their letter document.

The current document is included at the end in JSON. Return the FULL updated document every turn, keeping all previous information and ids.

Letter JSON shape: { kind, senderName, senderTitle, email, phone, location, company, role, recipientName, achievements: [string], body: [string], valediction: string, reason: string } where kind is "cover" (specific role/company) or "application" (interest/company), achievements are selling points, body is paragraphs, valediction is the signoff, reason is the user's interest.

Rules:
- Stay in "onboarding" until the user has provided their name + title, the target company/role, recipient, selling points/achievements, and desired tone. Then switch to "chat".
- In chat mode, honor request like warmer/confident/professional tone, tighter length, adding a highlight, or a quality check. Rewrite body accordingly.
- "pending" is null unless you asked the user to paste a highlight/achievement and are waiting for it ("highlight").
- "suggestions" must be exactly 4 short example follow-ups the user could type.
- Never use em dashes (—) or en dashes (–). Use commas, periods, or plain hyphens instead.
- Respond in the same language as the user.`;

/* ── Retry + error surfacing ─────────────────────────────────────── */

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type ChatMessage = { role: "assistant" | "user"; content: string };

function toChatMessage(m: unknown): ChatMessage | null {
  if (typeof m !== "object" || m === null) return null;
  const raw = m as Record<string, unknown>;
  if (typeof raw.text !== "string" || typeof raw.role !== "string") return null;
  const role = raw.role === "ai" ? "assistant" : raw.role === "user" ? "user" : null;
  if (!role) return null;
  return { role, content: raw.text.trim() };
}

function parseRetryAfter(value: string | undefined): number | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed === "") return null;
  if (/^\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  const date = Date.parse(trimmed);
  if (!Number.isNaN(date)) return Math.max(0, (date - Date.now()) / 1000);
  return null;
}

// Groq structured output occasionally returns a "failed_generation"
// completion: the model emitted malformed JSON and the API rejects it with a
// 400. It is a one-off glitch, not a prompt error — retrying usually succeeds.
// "No object generated" is the SDK's local zod/parse rejection of a
// response that slipped past the provider; those are transient too.
function isSchemaGlitch(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    /failed_generation/i.test(message) ||
    /does not match the expected schema/i.test(message) ||
    /does not validate with \/required/i.test(message) ||
    /no object generated/i.test(message) ||
    /did not match schema/i.test(message) ||
    /unable to parse|invalid json/i.test(message)
  );
}

function isRateLimitMessage(message: string): boolean {
  return (
    /rate limit|too many requests|tokens per minute|tpm|requested \d+ tokens/i.test(
      message
    )
  );
}

// Groq reports how long to wait either as a `retry-after` header or inline in
// the error body ("Please try again in Xms."). Prefer the precise number so
// rate-limit retries line up with the rolling token window.
function parseRetryAfterMs(error: unknown): number | null {
  if (APICallError.isInstance(error)) {
    const retryAfter = parseRetryAfter(error.responseHeaders?.["retry-after"]);
    if (retryAfter !== null && retryAfter > 0) {
      return Math.min(Math.ceil(retryAfter), 30) * 1000;
    }
  }
  const message = error instanceof Error ? error.message : String(error);
  const match = message.match(/try again in ([\d.]+)\s*ms/i);
  if (match) return Math.min(Math.ceil(Number(match[1])), 30000);
  return null;
}

// Returns the ms to wait before the next attempt, or null when the error
// should not be retried (or retries are exhausted).
function retryDelay(error: unknown, attempt: number): number | null {
  if (isSchemaGlitch(error)) {
    return attempt < 3 ? 2000 * (attempt + 1) : null;
  }

  const message = error instanceof Error ? error.message : String(error);
  const isRateLimit =
    message !== "" &&
    (APICallError.isInstance(error)
      ? error.statusCode === 429 || isRateLimitMessage(message)
      : isRateLimitMessage(message));

  if (isRateLimit) {
    // Groq free tier enforces a rolling 60s token window that refills
    // continuously, so keep retrying with the reported wait rather than
    // giving up after 3 quick tries.
    if (attempt >= 5) return null;
    return Math.min(parseRetryAfterMs(error) ?? 3000, 30000);
  }

  if (attempt >= 3) return null;

  if (APICallError.isInstance(error)) {
    if (error.statusCode === 408 || (error.statusCode ?? 0) >= 500) {
      return 1000 * 2 ** attempt;
    }
    return error.isRetryable ? 1000 * 2 ** attempt : null;
  }

  if (/network|socket|ECONNRESET|ECONNREFUSED|ETIMEDOUT|fetch failed|temporary/i.test(message)) {
    return 1000 * 2 ** attempt;
  }
  return null;
}

type GenerateOptions<T extends z.ZodTypeAny> = Omit<
  Parameters<typeof generateObject>[0],
  "schema" | "messages" | "prompt"
> & {
  schema: T;
  messages: ChatMessage[];
  prompt?: undefined;
};

async function generateWithRetry<T extends z.ZodTypeAny>(
  options: GenerateOptions<T>
): Promise<GenerateObjectResult<z.output<T>>> {
  for (let attempt = 0; ; attempt++) {
    try {
      return (await generateObject(options)) as GenerateObjectResult<
        z.output<T>
      >;
    } catch (error) {
      const delay = retryDelay(error, attempt);
      if (delay === null) throw error;
      await sleep(delay);
    }
  }
}

function toErrorResponse(error: unknown) {
  if (isSchemaGlitch(error)) {
    return {
      error:
        "The AI returned a malformed response. It usually works when retried; tap \"Try again\", or wait a moment and send your message again.",
      retryable: true,
      status: 502,
    };
  }

  if (APICallError.isInstance(error)) {
    if (error.statusCode === 429) {
      return {
        error:
          "The AI assistant is rate-limited right now. Wait a few seconds, then tap Retry.",
        retryable: true,
        status: 429,
      };
    }
    const status =
      error.statusCode && error.statusCode >= 400 && error.statusCode < 600
        ? error.statusCode
        : 502;
    return {
      error: error.message || "AI request failed",
      retryable: error.isRetryable,
      status,
    };
  }
  if (error instanceof Error) {
    const message = error.message || "";
    return {
      error:
        isRateLimitMessage(message) && !APICallError.isInstance(error)
          ? "The AI assistant is rate-limited right now. Wait a few seconds, then tap Retry."
          : message || "AI generation failed",
      retryable:
        /network|timeout|socket|fetch|ETIMEDOUT|ECONN|rate limit|try again/i.test(
          message
        ),
      status: 502,
    };
  }
  return { error: "AI generation failed", retryable: false, status: 500 };
}

/* ── Route ───────────────────────────────────────────────────────── */

export async function POST(req: Request) {
  let body: {
    type?: string;
    stage?: string;
    document?: unknown;
    messages?: unknown;
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid JSON body" },
      { status: 400 }
    );
  }

  const { type, document, messages } = body;

  if (type !== "resume" && type !== "letter") {
    return NextResponse.json(
      { error: "type must be 'resume' or 'letter'" },
      { status: 400 }
    );
  }

  if (!Array.isArray(messages)) {
    return NextResponse.json(
      { error: "messages are required" },
      { status: 400 }
    );
  }

  const history: ChatMessage[] = messages
    .map(toChatMessage)
    .filter((m): m is ChatMessage => m !== null)
    .slice(-8);

  if (history.length === 0 || history[history.length - 1].role !== "user") {
    return NextResponse.json(
      { error: "the last message must come from the user" },
      { status: 400 }
    );
  }

  const schema = type === "resume" ? resumeOutputSchema : letterOutputSchema;
  const system = `${type === "resume" ? resumeSystem : letterSystem}\n\nCurrent document (JSON):\n${JSON.stringify(document)}`;

  try {
    const { object } = await generateWithRetry({
      model: groq(process.env.GROQ_MODEL ?? "openai/gpt-oss-120b"),
      // strictJsonSchema: false keeps json_schema response format and
      // validation, but uses Groq's grammar-free path instead of constrained
      // decoding. Constrained decoding is what throws the flaky
      // "failed_generation" rejection on long outputs; grammar-free just
      // validates whatever the model produced. The SDK still zod-validates
      // client-side and retries (isSchemaGlitch).
      providerOptions: { groq: { strictJsonSchema: false } },
      system,
      messages: history,
      schema,
      // Groq's internal SDK retry only backoffs ~500ms, which never clears the
      // 60s token window and hides the real 429 behind a generic wrapper. Let
      // generateWithRetry() own retry timing instead.
      maxRetries: 0,
      // Generous ceiling: Groq truncation during generation is the other
      // classic source of schema failures.
      maxOutputTokens: 16384,
    });

    return NextResponse.json({
      message: object.message,
      stage: object.stage,
      document: object.document,
      pending: object.pending,
      suggestions: [...new Set(object.suggestions)].slice(0, 4),
    });
  } catch (error) {
    console.error("[/api/generate] AI call failed:", error);
    const { error: message, retryable, status } = toErrorResponse(error);
    return NextResponse.json({ error: message, retryable }, { status });
  }
}