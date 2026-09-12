export type LetterKind = "cover" | "application";

export interface Letter {
  kind: LetterKind;
  senderName: string;
  senderTitle: string;
  email: string;
  phone: string;
  location: string;
  company: string;
  role: string;
  recipientName: string;
  achievements: string[];
  body: string[];
  valediction: string;
  reason: string;
}

export const LETTER_WIDTH = 480;

export const emptyLetter: Letter = {
  kind: "cover",
  senderName: "",
  senderTitle: "",
  email: "",
  phone: "",
  location: "",
  company: "",
  role: "",
  recipientName: "",
  achievements: [],
  body: [],
  valediction: "",
  reason: "",
};

export interface LetterQualityCheck {
  label: string;
  ok: boolean;
}

export interface LetterQualityResult {
  score: number;
  checks: LetterQualityCheck[];
}

export function computeLetterScore(letter: Letter): LetterQualityResult {
  const targetOk =
    letter.kind === "application"
      ? letter.company !== "" && (letter.reason ?? "").trim() !== ""
      : letter.company !== "" && letter.role !== "";

  const checks: LetterQualityCheck[] = [
    { label: "Sender info", ok: letter.senderName !== "" },
    { label: "Target & reason", ok: targetOk },
    { label: "Greeting", ok: letter.recipientName !== "" },
    { label: "Opening paragraph", ok: (letter.body[0]?.length ?? 0) >= 40 },
    { label: "Selling points", ok: letter.achievements.length > 0 },
    {
      label: "Strong closing",
      ok: (letter.body[letter.body.length - 1]?.length ?? 0) >= 40,
    },
    { label: "Sign-off", ok: letter.valediction !== "" },
  ];

  const passed = checks.filter((c) => c.ok).length;
  const score = Math.round((passed / checks.length) * 100);

  return { score, checks };
}