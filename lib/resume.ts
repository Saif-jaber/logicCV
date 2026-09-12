export interface ResumeExperience {
  id: string;
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface ResumeEducation {
  id: string;
  degree: string;
  school: string;
  period: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
}

export interface Resume {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: string[];
  projects: ResumeProject[];
}

export const emptyResume: Resume = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

export interface AtsCheck {
  label: string;
  ok: boolean;
}

export interface AtsResult {
  score: number;
  checks: AtsCheck[];
}

export function computeAts(resume: Resume): AtsResult {
  const checks: AtsCheck[] = [
    {
      label: "Contact info",
      ok: resume.email !== "" || resume.phone !== "" || resume.location !== "",
    },
    { label: "Job title", ok: resume.title !== "" },
    { label: "Summary", ok: resume.summary.trim().length >= 20 },
    {
      label: "Experience",
      ok: resume.experience.some(
        (exp) => exp.role !== "" || exp.company !== ""
      ),
    },
    { label: "Achievement bullets", ok: resume.experience.some((exp) => exp.bullets.length > 0) },
    { label: "Education", ok: resume.education.length > 0 },
    { label: "Skills", ok: resume.skills.length > 0 },
  ];

  const passed = checks.filter((c) => c.ok).length;
  const score = Math.round((passed / checks.length) * 100);

  return { score, checks };
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}