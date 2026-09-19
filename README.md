<p align="center">
  <img src="app/icon.svg" width="96" height="96" alt="logicCV logo" />
</p>

<h1 align="center">logicCV</h1>

<p align="center">
  Write ATS-friendly CVs and cover letters by talking to an AI assistant.<br />
  No templates, no drag and drop. Just a conversation.
</p>

<p align="center">
  <a href="https://github.com/Saif-jaber/logicCV"><img src="https://img.shields.io/badge/Next.js%2016-000000?logo=nextdotjs&logoColor=white" alt="Next.js 16" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React%2019-61DAFB?logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind%20CSS%20v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" /></a>
  <a href="https://www.prisma.io"><img src="https://img.shields.io/badge/Prisma%207-2D3748?logo=prisma&logoColor=white" alt="Prisma 7" /></a>
</p>

---

## Overview

logicCV is a resume, CV, and cover letter builder for people who would rather talk than type. A guided chat turns a blank page into a structured, ATS-friendly document in minutes. Resumes, cover letters, and application letters alike render beside the chat in a live preview that updates on every message.

Generation is backed by a real LLM (Groq) through the AI SDK, with retries, rate-limit awareness, and a JSON-schema validated response path so the builders stay reliable. All conversations, documents, and account details persist to Postgres.

## Features

- **Build by chat**: answer a few guided questions (name, role, contact, summary, experience, education, skills) and the assistant drafts the full resume.
- **Cover & application letters**: chat a letter into being. The assistant draws on the profile it already knows and handles the greeting, body, and sign-off.
- **Plain-word editing**: keep chatting to refine anything, e.g. "make my summary more confident", "add a project", "match this job description", or "regenerate the intro to my letter".
- **Live preview**: a paper-like resume or letter renders beside the chat and updates in real time.
- **ATS optimization**: a live score and checklist flag anything an applicant tracking system might miss.
- **One-click PDF export**: resumes and letters download as clean, print-ready PDFs with real selectable text (ATS-friendly, no screenshots).
- **Document library**: every draft is stored per user in Postgres and listed on your dashboard, with inline rename and delete (with a deletion reason) right from the card menu.
- **Settings**: edit your profile name and email, and change your password, from a dedicated settings page.
- **Responsive dashboard**: desktop sidebar with collapse and a mobile slide-in menu reachable from every page.
- **Role-based access**: sign-in and sign-up against the `users` table (bcrypt + JWT) with per-user dashboards and route protection. Admins land in the admin area; regular users get a 404 when they try to open `/admin`.
- **Admin dashboard**: live platform stats, a 14-day signup chart, recent signups, and the latest deletions, all read straight from Postgres.
- **Polished landing page**: subtle scroll animations, custom brand mark, a command palette, and a fully responsive layout.

## Tech stack

| Layer      | Technology |
| ---------- | ---------- |
| Framework  | Next.js 16 (App Router, Turbopack) |
| UI         | React 19, TypeScript |
| Styling    | Tailwind CSS v4 with a custom design token set |
| Components | shadcn/ui on Base UI |
| AI         | Vercel AI SDK with the Groq provider (`gpt-oss-120b`) |
| Auth       | Auth.js (next-auth v5) with Prisma adapter |
| Database   | PostgreSQL via Prisma 7 + `@prisma/adapter-pg` |

## Getting started

### Prerequisites

- Node.js 20 or newer
- PostgreSQL 15 or newer
- A Groq API key from the [Groq console](https://console.groq.com)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Saif-jaber/logicCV.git
cd logicCV

# 2. Install dependencies
npm install

# 3. Configure environment variables (see below)
cp .env.example .env

# 4. Create the database schema
npx prisma db push

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app defaults to the landing page; use the auth dialogs to reach the dashboard.

### Environment variables

| Variable       | Required | Description                                                          |
| -------------- | -------- | -------------------------------------------------------------------- |
| `DATABASE_URL` | Yes      | PostgreSQL connection string (e.g. `postgresql://user:pass@host:5432/logiccv`) |
| `AUTH_SECRET`  | Yes      | Secret used by Auth.js to sign sessions. Generate one with `openssl rand -base64 32`. |
| `GROQ_API_KEY` | Yes*     | Groq API key used by the AI generation route. Required for the builders. |
| `GROQ_MODEL`   | No       | Groq model id, defaults to `openai/gpt-oss-120b`. |

\* The app boots without it, but the resume and letter builders will not respond until a key is set.

### AI generation

Chat generation lives in `app/api/generate/route.ts`. Every turn calls Groq with a strict JSON-schema response, then validates the result with zod before it reaches the UI. Schema glitches and provider hiccups are retried with backoff, and free-tier token rate limits are surfaced as clear retryable messages.

## Scripts

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `npm run dev`      | Start the Next.js dev server                 |
| `npm run build`    | Create a production build                    |
| `npm run start`    | Start the production server                  |
| `npm run lint`     | Run ESLint across the project                |
| `npx prisma db push` | Sync the schema to the database            |

## Project structure

```
app/                 App Router pages and layouts
  dashboard/         Dashboard, resumes list, builders, settings
  (admin)/admin/     Admin area (overview, users, deletion log)
  api/generate/      AI generation route (Groq + zod validation)
  actions/           Server actions (auth, documents, settings)
  page.tsx           Landing page
components/
  landing/           Landing page sections and command palette
  resume/            Resume builder and live preview
  letter/            Letter builder and live preview
  settings/          Profile and password settings forms
  dashboard/         Shared dashboard bits (mobile nav)
  ui/                shadcn/ui primitives (button, dialog, input, ...)
  sidebar.tsx        App sidebar (desktop rail + mobile drawer)
lib/
  resume-ai.ts       Resume conversation engine (client -> /api/generate)
  letter-ai.ts       Letter conversation engine
  documents.ts       Server fetchers for user resumes and letters
  resume.ts          Resume model and ATS scoring
  letter.ts          Letter model and scoring
  pdf.ts             Client-side PDF download helper
  prisma.ts          Prisma client (Postgres driver adapter)
prisma/schema.prisma Database schema
tokens.css           Global design tokens (colors, fonts, radii)
auth.ts              Auth.js configuration
proxy.ts             Route-level auth and role protection
```

## Status

- Auth uses Auth.js v5 with the Credentials provider; sign-up and sign-in verify against the `users` table and issue JWT sessions, with real per-user document storage in Postgres.
- Roles: users have a `role` column (`user` / `admin`). `/admin` and its pages are locked to admins (regular users get a 404), and admins are redirected away from the user dashboard to the admin area.
- The admin overview reads live data from the database: total users and admins, deletions over the last 14 days, a daily signup chart, the latest signups, and the most recent deletions.
- Resumes and letters are persisted per user in Postgres, listed on the dashboard, and support inline rename and delete (with a deletion reason) from each document card.
- PDF export runs fully client-side with vector text (via `@react-pdf/renderer`), so documents are parseable by ATS software without any backend.
- Discussion with the AI is live through the Groq API; output style rules (no em dashes, ATS-friendly wording) are enforced in the system prompt.

## Roadmap

- [x] Landing page with animations and command palette
- [x] Chat-driven resume builder with live ATS preview
- [x] Chat-driven cover and application letter builder with live preview
- [x] One-click ATS-friendly PDF export
- [x] Real credential verification and per-user dashboards
- [x] Persist documents per user (Prisma models + rename/delete with reason)
- [x] Users `role` column (`user` / `admin`) with admin area and role-based route protection
- [x] Live AI generation via Groq with retries and JSON-schema validation
- [x] Profile and password settings page
- [ ] Multi-plan / paid tiers and usage limits
- [ ] Shared (team) workspaces for resumes and letters

## License

This project is currently private. Reuse of the code or brand requires permission from the maintainer.