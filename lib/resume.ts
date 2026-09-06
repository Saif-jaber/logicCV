export interface DocumentCard {
  id: string;
  name: string;
  updatedAt: string;
  resume: Resume;
}

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

export const documents: DocumentCard[] = [
  {
    id: "1",
    name: "Joel's Resume",
    updatedAt: "Last updated 2 days ago",
    resume: {
      name: "Joel Koyoo",
      title: "Senior Software Engineer",
      email: "joel.koyoo@gmail.com",
      phone: "+254 712 345 678",
      location: "Nairobi, Kenya",
      summary:
        "Full-stack developer with 6+ years building large-scale web applications. Specialized in TypeScript, React, and Node.js, with a focus on performance and developer experience.",
      experience: [
        {
          id: "1",
          role: "Senior Software Engineer",
          company: "TechCorp",
          period: "2022 — Present",
          bullets: [
            "Led migration of a legacy codebase to Next.js, cutting page load times by 62%",
            "Mentored 5 junior developers and ran weekly code review sessions",
          ],
        },
        {
          id: "2",
          role: "Frontend Engineer",
          company: "StartupHub",
          period: "2020 — 2022",
          bullets: [
            "Built a design system used by 4 product teams",
            "Shipped real-time collaboration features serving 50k monthly users",
          ],
        },
      ],
      education: [
        {
          id: "1",
          degree: "BSc Computer Science",
          school: "University of Nairobi",
          period: "2015 — 2019",
        },
      ],
      skills: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "AWS"],
      projects: [
        {
          id: "1",
          name: "LogicCV",
          description:
            "AI-powered resume builder that generates ATS-friendly CVs through conversation.",
        },
      ],
    },
  },
  {
    id: "2",
    name: "Product Manager CV",
    updatedAt: "Last updated 5 days ago",
    resume: {
      name: "Amara Ochieng",
      title: "Senior Product Manager",
      email: "amara.ochieng@gmail.com",
      phone: "+254 700 112 233",
      location: "Nairobi, Kenya",
      summary:
        "Product manager with 8 years across fintech and SaaS. Proven track record taking products from 0 to 1 and scaling them to millions of users.",
      experience: [
        {
          id: "1",
          role: "Senior Product Manager",
          company: "PayWave",
          period: "2021 — Present",
          bullets: [
            "Owned the growth roadmap, increasing monthly active users by 3.2x",
            "Launched a payment feature that grew to 15% of company revenue in 6 months",
          ],
        },
        {
          id: "2",
          role: "Product Manager",
          company: "FinEdge",
          period: "2018 — 2021",
          bullets: [
            "Shipped mobile-first onboarding, raising conversion by 28%",
          ],
        },
      ],
      education: [
        {
          id: "1",
          degree: "MBA",
          school: "Strathmore Business School",
          period: "2016 — 2018",
        },
      ],
      skills: ["Product Strategy", "SQL", "Figma", "Agile", "User Research"],
      projects: [],
    },
  },
  {
    id: "3",
    name: "Frontend Developer Resume",
    updatedAt: "Last updated 2 weeks ago",
    resume: {
      name: "Brian Mwangi",
      title: "Frontend Developer",
      email: "brian.mwangi@gmail.com",
      phone: "+254 722 334 455",
      location: "Nakuru, Kenya",
      summary:
        "Frontend developer passionate about clean, accessible, and delightful UI. 4 years of experience turning complex problems into simple interfaces.",
      experience: [
        {
          id: "1",
          role: "Frontend Developer",
          company: "PixelWorks",
          period: "2022 — Present",
          bullets: [
            "Designed and built component libraries used across 12 products",
            "Improved Lighthouse accessibility scores from 74 to 98",
          ],
        },
        {
          id: "2",
          role: "Junior UI Developer",
          company: "DigitalCraft",
          period: "2020 — 2022",
          bullets: [
            "Delivered 20+ marketing sites with a 100% score on Core Web Vitals",
          ],
        },
      ],
      education: [
        {
          id: "1",
          degree: "Diploma in Software Development",
          school: "Power Learn Project",
          period: "2018 — 2020",
        },
      ],
      skills: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Figma"],
      projects: [
        {
          id: "1",
          name: "Design System",
          description:
            "Open-source design system with 40+ accessible components used by 300+ developers.",
        },
      ],
    },
  },
  {
    id: "4",
    name: "Test Resume",
    updatedAt: "Last updated 1 month ago",
    resume: {
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
    },
  },
];

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