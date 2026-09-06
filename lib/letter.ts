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

export interface LetterDocument {
  id: string;
  name: string;
  updatedAt: string;
  letter: Letter;
}

export const letters: LetterDocument[] = [
  {
    id: "l1",
    name: "Cover Letter — PayWave",
    updatedAt: "Last updated 1 day ago",
    letter: {
      ...emptyLetter,
      kind: "cover",
      senderName: "Amara Ochieng",
      senderTitle: "Senior Product Manager",
      email: "amara.ochieng@gmail.com",
      phone: "+254 700 112 233",
      location: "Nairobi, Kenya",
      company: "PayWave",
      role: "Senior Product Manager",
      recipientName: "Sarah Kamau",
      achievements: [
        "increased monthly active users by 3.2x through the growth roadmap",
        "launched a payments feature that grew to 15% of company revenue",
      ],
      body: [
        "I'm writing to express my strong interest in the Senior Product Manager role at PayWave.",
        "In my current work I increased monthly active users by 3.2x through the growth roadmap, I also launched a payments feature that grew to 15% of company revenue. These wins would carry straight over to PayWave.",
        "I would welcome the chance to discuss how I can contribute to PayWave. Thank you for your consideration.",
      ],
      valediction: "Best regards",
    },
  },
  {
    id: "l2",
    name: "Application Letter — Vertex Logistics",
    updatedAt: "Last updated 3 days ago",
    letter: {
      ...emptyLetter,
      kind: "application",
      senderName: "Wanjiku Njeri",
      senderTitle: "Executive Assistant",
      email: "wanjiku.njeri@gmail.com",
      phone: "+254 733 445 566",
      location: "Nairobi, Kenya",
      company: "Vertex Logistics",
      role: "",
      recipientName: "Daniel Muthoni",
      achievements: [
        "managed calendars for a C-suite of 5 executives",
        "cut travel booking costs by 18% through vendor negotiations",
      ],
      reason:
        "Vertex Logistics' rapid growth and reputation for operational excellence",
      body: [
        "I am writing to express my interest in opportunities with Vertex Logistics.",
        "What draws me to Vertex Logistics is Vertex Logistics' rapid growth and reputation for operational excellence. In my current work I managed calendars for a C-suite of 5 executives, I also cut travel booking costs by 18% through vendor negotiations. These strengths would support your team.",
        "I would welcome the chance to discuss how I could contribute to Vertex Logistics. Thank you for your consideration.",
      ],
      valediction: "Warm regards",
    },
  },
  {
    id: "l3",
    name: "Test Letter",
    updatedAt: "Last updated 1 month ago",
    letter: { ...emptyLetter },
  },
];

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