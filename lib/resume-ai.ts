import {
  computeAts,
  emptyResume,
  uid,
  type Resume,
  type ResumeExperience,
  type ResumeEducation,
} from "@/lib/resume";

export type AiStage = "onboarding" | "chat";

export type PendingAction = "summary" | "experience" | "skills" | "project";

export interface AiResult {
  message: string;
  resume: Resume;
  stage: AiStage;
  pending: PendingAction | null;
  suggestions: string[];
}

export interface MockStepInput {
  input: string;
  resume: Resume;
  stage: AiStage;
  stepIndex: number;
  pending: PendingAction | null;
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

function splitTop(
  text: string,
  re: RegExp = /(?:-|,|\|| at )/i
): string[] {
  return text
    .split(re)
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitBullets(text: string): string[] {
  return text
    .split(/\n|•|;/)
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

function parseContact(text: string): {
  email: string;
  phone: string;
  location: string;
} {
  const email = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/)?.[0] || "";
  const phone =
    text.match(/(?:\+?\d[\d\s\-().]{6,}\d)/)?.[0] ||
    text.match(/\d{7,}/)?.[0] ||
    "";
  const rest = text
    .replace(email, "")
    .replace(phone, "")
    .replace(/[,;|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return { email, phone, location: rest };
}

function parseEducation(text: string): { degree: string; school: string } {
  const parts = splitTop(text, /(?:,| at )/i);
  return {
    degree: parts[0] || text,
    school: parts[1] || "",
  };
}

function onboardingResult(
  message: string,
  resume: Resume,
  nextStep: number
): MockStepOutput {
  return {
    result: {
      message,
      resume,
      stage: "onboarding",
      pending: null,
      suggestions: [],
    },
    stepIndex: nextStep,
  };
}

function handleOnboarding(
  input: string,
  resume: Resume,
  stepIndex: number
): MockStepOutput {
  switch (stepIndex) {
    case 0: {
      const parts = splitTop(input);
      resume.name = parts[0] || input;
      resume.title = parts[1] || "Professional";
      return onboardingResult(
        `Great. "${resume.name}", ${resume.title}. Now let's get your contact details: email, phone number, and location (city is fine).`,
        resume,
        1
      );
    }
    case 1: {
      const contact = parseContact(input);
      resume.email = contact.email;
      resume.phone = contact.phone;
      resume.location = contact.location;
      return onboardingResult(
        `Saved${
          contact.email ? ` ${contact.email}` : ""
        }. Next, write a short professional summary: 2-3 sentences about what you do best.`,
        resume,
        2
      );
    }
    case 2: {
      resume.summary = input.trim();
      return onboardingResult(
        "Nice. Now your most recent role: company and title, like \"Product Manager at Google\".",
        resume,
        3
      );
    }
    case 3: {
      const role = parseRoleLine(input);
      const entry: ResumeExperience = {
        id: uid(),
        role: role.role,
        company: role.company,
        period: "",
        bullets: [],
      };
      resume.experience.push(entry);
      return onboardingResult(
        `Added ${entry.role}${entry.company ? ` at ${entry.company}` : ""}. Paste 2-3 achievements from that role, one per line.`,
        resume,
        4
      );
    }
    case 4: {
      const entry = resume.experience[resume.experience.length - 1];
      if (entry) entry.bullets = splitBullets(input);
      return onboardingResult(
        "Those will catch a recruiter's eye. Education next: degree and school, like \"BSc Computer Science, MIT\".",
        resume,
        5
      );
    }
    case 5: {
      const edu = parseEducation(input);
      const entry: ResumeEducation = {
        id: uid(),
        degree: edu.degree,
        school: edu.school,
        period: "",
      };
      resume.education.push(entry);
      return onboardingResult(
        "And finally, list your key skills, comma separated.",
        resume,
        6
      );
    }
    default: {
      resume.skills = input
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      return {
        result: {
          message:
            "Perfect. Your resume is drafted. Look at the preview on the right. From here you can just talk to me naturally: ask me to polish the summary, add projects, match a job description, or run an ATS check. What would you like to improve first?",
          resume,
          stage: "chat",
          pending: null,
          suggestions: [...chatSuggestions],
        },
        stepIndex: stepIndex + 1,
      };
    }
  }
}

function chatResult(
  message: string,
  resume: Resume,
  pending: PendingAction | null
): MockStepOutput {
  return {
    result: {
      message,
      resume,
      stage: "chat",
      pending,
      suggestions: [...chatSuggestions],
    },
    stepIndex: 0,
  };
}

function handleChat(
  input: string,
  resume: Resume,
  pending: PendingAction | null
): MockStepOutput {
  const text = input.trim().toLowerCase();

  if (pending === "summary") {
    resume.summary = input.trim();
    return chatResult(
      "Done. Your summary is updated. Want me to tailor it to a specific job description?",
      resume,
      null
    );
  }

  if (pending === "skills") {
    const added = input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    resume.skills = Array.from(new Set([...resume.skills, ...added]));
    return chatResult(
      `Skills updated: ${resume.skills.join(", ")}. Anything else?`,
      resume,
      null
    );
  }

  if (pending === "experience") {
    const role = parseRoleLine(input);
    const entry: ResumeExperience = {
      id: uid(),
      role: role.role,
      company: role.company,
      period: "",
      bullets: [],
    };
    resume.experience.push(entry);
    return chatResult(
      `Experience added: ${entry.role}${
        entry.company ? ` at ${entry.company}` : ""
      }. Send 2-3 achievement bullets and I'll attach them.`,
      resume,
      null
    );
  }

  if (pending === "project") {
    const [name, ...rest] = splitTop(input, /(?:[:]| at )/i);
    resume.projects.push({
      id: uid(),
      name: name || input,
      description: rest.join(" ") || "A project worth showing.",
    });
    const added = resume.projects[resume.projects.length - 1];
    return chatResult(
      `Project "${added.name}" added to the preview.`,
      resume,
      null
    );
  }

  if (/export|pdf|download/.test(text)) {
    return chatResult(
      "PDF export goes live once the backend is connected. For now your resume stays safe in the app. Keep polishing it!",
      resume,
      null
    );
  }

  if (/ats|score|check|pars/.test(text)) {
    const ats = computeAts(resume);
    const missing = ats.checks
      .filter((c) => !c.ok)
      .map((c) => c.label.toLowerCase());
    return chatResult(
      missing.length === 0
        ? `Strong ATS result: ${ats.score}/100. All core sections are covered, nice work.`
        : `ATS check: ${ats.score}/100. Missing: ${missing.join(
            ", "
          )}. Tell me which one to add and I'll fix it.`,
      resume,
      null
    );
  }

  if (/match|jd|job description|optimiz|tailor/.test(text)) {
    const keywords = ["collaboration", "agile", "results-driven"];
    const added = keywords.filter(
      (k) => !resume.skills.some((s) => s.toLowerCase().includes(k))
    );
    resume.skills = Array.from(new Set([...resume.skills, ...added]));
    return chatResult(
      `I reviewed the job description and added high-signal keywords: ${added.join(
        ", "
      )}. Want me to rewrite your summary to echo them?`,
      resume,
      null
    );
  }

  if (/skill/.test(text)) {
    return chatResult(
      "Sure. Paste the skills you want, comma separated, and I'll add them.",
      resume,
      "skills"
    );
  }

  if (/summar/.test(text)) {
    return chatResult(
      "Send me the new summary text, or tell me the tone you want, like 'more confident'.",
      resume,
      "summary"
    );
  }

  if (/project/.test(text)) {
    return chatResult(
      "Great. Project name and one line, e.g. \"Portfolio Site, built with Next.js\".",
      resume,
      "project"
    );
  }

  if (/experienc|work|job|role|hired/.test(text)) {
    return chatResult(
      "Awesome. Company and role, e.g. \"Product Manager at Google\".",
      resume,
      "experience"
    );
  }

  return chatResult(
    "Noted. I can add skills, projects, tweak your summary, or run an ATS check. What should I do next?",
    resume,
    null
  );
}

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

export function step(input: MockStepInput): MockStepOutput {
  const resume: Resume = JSON.parse(JSON.stringify(input.resume));
  if (input.stage === "onboarding") {
    return handleOnboarding(input.input, resume, input.stepIndex);
  }
  return handleChat(input.input, resume, input.pending);
}