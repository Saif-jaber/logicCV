import {
  computeLetterScore,
  emptyLetter,
  type Letter,
  type LetterKind,
} from "@/lib/letter";

export type LetterStage = "onboarding" | "chat";

export type LetterPending = "highlight";

export interface LetterAiResult {
  message: string;
  letter: Letter;
  stage: LetterStage;
  pending: LetterPending | null;
  suggestions: string[];
}

export interface LetterStepInput {
  input: string;
  letter: Letter;
  stage: LetterStage;
  stepIndex: number;
  pending: LetterPending | null;
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

type Tone = "professional" | "warm" | "confident";

function composeOpening(letter: Letter, tone: Tone): string {
  if (letter.kind === "application") {
    const reason =
      (letter.reason ?? "").trim() ||
      `${letter.company || "your organization"}'s reputation and vision`;
    const base =
      tone === "warm"
        ? `I was genuinely inspired by ${reason}, so I'm writing to express my interest in joining ${letter.company || "your organization"}.`
        : tone === "confident"
          ? `I'm confident my background would be a strong fit for ${letter.company || "your organization"}, which drew me in through ${reason}.`
          : `I am writing to express my interest in opportunities with ${letter.company || "your organization"}.`;
    return base;
  }
  const opener =
    tone === "warm"
      ? `I was genuinely excited to see the ${letter.role || "opening"}`
      : tone === "confident"
        ? `I'm confident I'm the right fit for the ${letter.role || "role"}`
        : `I'm writing to express my strong interest in the ${letter.role || "role"}`;
  return `${opener}${letter.company ? ` at ${letter.company}` : ""}.`;
}

const valedictions: Record<Tone, string> = {
  professional: "Best regards",
  warm: "Warm regards",
  confident: "Sincerely",
};

function composeClosing(letter: Letter, tone: Tone): string {
  const org = letter.company || "your team";
  if (letter.kind === "application") {
    return `I would welcome the chance to discuss how I could contribute to ${org}. Thank you for your consideration.`;
  }
  return tone === "warm"
    ? `I'd love to chat about how I could help ${org} grow. I'm flexible and happy to work around your schedule.`
    : tone === "confident"
      ? `I look forward to speaking with you, and I'm ready to make an impact at ${org} from day one.`
      : `I would welcome the chance to discuss how I can contribute to ${org}. Thank you for your consideration.`;
}

function pickTone(text: string): Tone {
  const t = text.toLowerCase();
  if (/warm|friendly|casual|personable|human/.test(t)) return "warm";
  if (/confident|bold|assertive|strong|impact/.test(t)) return "confident";
  return "professional";
}

function toneFromLetter(letter: Letter): Tone {
  if (letter.valediction === "Warm regards") return "warm";
  if (letter.valediction === "Sincerely") return "confident";
  return "professional";
}

export function composeBody(letter: Letter, tone: Tone): string[] {
  const wins = letter.achievements.map(
    (a, i) =>
      `${i === 0 ? "I" : "I also"} ${a.charAt(0).toLowerCase() + a.slice(1)}`
  );
  const middle =
    wins.length > 0
      ? `${wins.join(", ")}.${
          letter.company
            ? ` These strengths would ${
                letter.kind === "application"
                  ? "support your team"
                  : "carry straight over"
              } to ${letter.company}.`
            : ""
        }`
      : "My background maps closely to the challenges this role owns. I would bring energy, focus, and a bias for shipping results.";

  return [composeOpening(letter, tone), middle, composeClosing(letter, tone)];
}

function splitTop(text: string, re: RegExp = /(?:-|,|\|| at )/i): string[] {
  return text
    .split(re)
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitLines(text: string): string[] {
  return text
    .split(/\n|•|;|,/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function parseRoleLine(text: string): { role: string; company: string } {
  const atMatch = text.match(/^(.+?)\s+at\s+(.+)$/i);
  if (atMatch) {
    return { role: atMatch[1].trim(), company: atMatch[2].trim() };
  }
  const parts = splitTop(text, /(?:,|\|)/i);
  return {
    role: parts[0] || text,
    company: parts[1] || "",
  };
}

function letterOnboardingResult(
  message: string,
  letter: Letter,
  nextStep: number
): LetterStepOutput {
  return {
    result: {
      message,
      letter,
      stage: "onboarding",
      pending: null,
      suggestions: [],
    },
    stepIndex: nextStep,
  };
}

function handleOnboarding(
  input: string,
  letter: Letter,
  stepIndex: number
): LetterStepOutput {
  // Step 0: choose the kind of letter first
  if (stepIndex === 0) {
    const t = input.trim().toLowerCase();
    const kind: LetterKind =
      /application|general interest|speculative|joining/.test(t)
        ? "application"
        : /cover|job|role|position|apply/.test(t)
          ? "cover"
          : "cover";
    letter.kind = kind;
    return letterOnboardingResult(
      `Great, let's write a ${
        kind === "application" ? "application" : "cover"
      } letter! First: your full name and current title. (e.g. "Amara Ochieng, Senior Product Manager")`,
      letter,
      1
    );
  }

  if (letter.kind === "application") {
    return handleApplicationOnboarding(input, letter, stepIndex);
  }
  return handleCoverOnboarding(input, letter, stepIndex);
}

function handleCoverOnboarding(
  input: string,
  letter: Letter,
  stepIndex: number
): LetterStepOutput {
  switch (stepIndex) {
    case 1: {
      const parts = splitTop(input);
      letter.senderName = parts[0] || input;
      letter.senderTitle = parts[1] || "Professional";
      return letterOnboardingResult(
        `Nice to meet you, ${letter.senderName}. Which company and role is this cover letter for? e.g. "Senior Product Manager at PayWave".`,
        letter,
        2
      );
    }
    case 2: {
      const role = parseRoleLine(input);
      letter.role = role.role;
      letter.company = role.company;
      return letterOnboardingResult(
        `Great, a ${letter.role}${role.company ? ` at ${role.company}` : ""}. Who should it be addressed to? A hiring manager's name, or just say "Hiring Manager".`,
        letter,
        3
      );
    }
    case 3: {
      letter.recipientName = input.trim() || "Hiring Manager";
      return letterOnboardingResult(
        `Perfect. Now the heart of the letter: paste 2-3 strong selling points related to this role, one per line.`,
        letter,
        4
      );
    }
    case 4: {
      letter.achievements = splitLines(input);
      return letterOnboardingResult(
        `Those will land. Last question: how should the letter sound: professional, warm, or confident?`,
        letter,
        5
      );
    }
    default: {
      const tone = pickTone(input);
      letter.body = composeBody(letter, tone);
      letter.valediction = valedictions[tone];
      return {
        result: {
          message:
            "Your cover letter is drafted. The preview on the right shows three paragraphs built around your selling points. From here you can tell me to make it warmer, add a highlight, tighten it up, or run a quality check. What would you like?",
          letter,
          stage: "chat",
          pending: null,
          suggestions: [...letterChatSuggestions],
        },
        stepIndex: stepIndex + 1,
      };
    }
  }
}

function handleApplicationOnboarding(
  input: string,
  letter: Letter,
  stepIndex: number
): LetterStepOutput {
  switch (stepIndex) {
    case 1: {
      const parts = splitTop(input);
      letter.senderName = parts[0] || input;
      letter.senderTitle = parts[1] || "Professional";
      return letterOnboardingResult(
        `Nice to meet you, ${letter.senderName}. Which organization would you like to apply to? (e.g. "Vertex Logistics")`,
        letter,
        2
      );
    }
    case 2: {
      letter.company = input.trim();
      return letterOnboardingResult(
        `Good choice. What draws you to ${letter.company}? Give a short reason, such as their mission, culture, or an initiative you admire.`,
        letter,
        3
      );
    }
    case 3: {
      letter.reason = input.trim();
      return letterOnboardingResult(
        `That's compelling. Who should it be addressed to? A name, or just say "Hiring Manager".`,
        letter,
        4
      );
    }
    case 4: {
      letter.recipientName = input.trim() || "Hiring Manager";
      return letterOnboardingResult(
        `Perfect. Now the heart of the letter: paste 2-3 strong selling points, one per line.`,
        letter,
        5
      );
    }
    case 5: {
      letter.achievements = splitLines(input);
      return letterOnboardingResult(
        `Those will land. Last question: how should the letter sound: professional, warm, or confident?`,
        letter,
        6
      );
    }
    default: {
      const tone = pickTone(input);
      letter.body = composeBody(letter, tone);
      letter.valediction = valedictions[tone];
      return {
        result: {
          message:
            "Your application letter is drafted. The preview on the right shows why you're interested in the company and what you'd bring. From here you can tell me to make it warmer, add a highlight, tighten it up, or run a quality check. What would you like?",
          letter,
          stage: "chat",
          pending: null,
          suggestions: [...letterChatSuggestions],
        },
        stepIndex: stepIndex + 1,
      };
    }
  }
}

function letterChatResult(
  message: string,
  letter: Letter,
  pending: LetterPending | null
): LetterStepOutput {
  return {
    result: {
      message,
      letter,
      stage: "chat",
      pending,
      suggestions: [...letterChatSuggestions],
    },
    stepIndex: 0,
  };
}

function handleChat(
  input: string,
  letter: Letter,
  pending: LetterPending | null
): LetterStepOutput {
  const text = input.trim().toLowerCase();

  if (pending === "highlight") {
    letter.achievements = [...letter.achievements, input.trim()].filter(Boolean);
    letter.body = composeBody(letter, toneFromLetter(letter));
    return letterChatResult(
      "Wove that highlight into the letter. Take a look at the preview. Anything else?",
      letter,
      null
    );
  }

  if (/warm|friendly|warmer|casual|personable/.test(text)) {
    letter.body = composeBody(letter, "warm");
    letter.valediction = valedictions.warm;
    return letterChatResult(
      "Adjusted the tone to be warmer and more human. Want to tweak anything else?",
      letter,
      null
    );
  }

  if (/confident|bold|assertive|strong|impact/.test(text)) {
    letter.body = composeBody(letter, "confident");
    letter.valediction = valedictions.confident;
    return letterChatResult(
      "Made it more confident. The letter now leads with impact. What next?",
      letter,
      null
    );
  }

  if (/professional|formal|official/.test(text)) {
    letter.body = composeBody(letter, "professional");
    letter.valediction = valedictions.professional;
    return letterChatResult(
      "Set a polished, professional tone. Anything you'd like revised?",
      letter,
      null
    );
  }

  if (/tighten|shorten|condense|concise|brief|crisp/.test(text)) {
    if (letter.body.length > 2) {
      letter.body = [
        letter.body[0],
        `${letter.body[1]} ${letter.body[2]}`,
      ];
    }
    return letterChatResult(
      "Tightened it into two punchy paragraphs. Say the word if you want it even shorter.",
      letter,
      null
    );
  }

  if (/quality|check|score|complete|grade|review/.test(text)) {
    const quality = computeLetterScore(letter);
    const missing = quality.checks
      .filter((c) => !c.ok)
      .map((c) => c.label.toLowerCase());
    return letterChatResult(
      missing.length === 0
        ? `Quality check: ${quality.score}/100. Every section is covered, so this letter is ready to send.`
        : `Quality check: ${quality.score}/100. Missing: ${missing.join(
            ", "
          )}. Tell me which one to fix and I'll handle it.`,
      letter,
      null
    );
  }

  if (/highlight|achievement|win|accomplish|strength|result/.test(text)) {
    return letterChatResult(
      "Sure. Paste the achievement or selling point and I'll weave it into the letter.",
      letter,
      "highlight"
    );
  }

  if (/export|pdf|download|print/.test(text)) {
    return letterChatResult(
      "PDF export goes live once the backend is connected. For now your letter stays safe in the app. Keep polishing it!",
      letter,
      null
    );
  }

  return letterChatResult(
    "I can adjust the tone (warmer, more confident, formal), add a highlight, tighten the draft, or run a quality check. What should I do next?",
    letter,
    null
  );
}

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

export function stepLetter(input: LetterStepInput): LetterStepOutput {
  const letter: Letter = JSON.parse(JSON.stringify(input.letter));
  if (input.stage === "onboarding") {
    return handleOnboarding(input.input, letter, input.stepIndex);
  }
  return handleChat(input.input, letter, input.pending);
}