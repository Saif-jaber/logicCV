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

logicCV is a resume, CV, and cover letter builder for people who would rather talk than type. A guided chat turns a blank page into a structured, ATS-friendly document in minutes — resumes, cover letters, and application letters alike — with a live preview that updates on every message.

The AI assistant currently runs on well-defined rule-based engines (`lib/resume-ai.ts` and `lib/letter-ai.ts`) that are ready to be swapped for a real model; every conversation now persists to Postgres through server actions.

## Features

- **Build by chat**: answer a few guided questions (name, role, contact, summary, experience, education, skills) and the assistant drafts the full resume.
- **Cover & application letters**: chat a letter into being — the assistant draws on the profile it already knows and handles the greeting, body, and sign-off.
- **Plain-word editing**: keep chatting to refine anything, e.g. "make my summary more confident", "add a project", "match this job description", or "regenerate the intro to my letter".
- **Live preview**: a paper-like resume or letter renders beside the chat and updates in real time.
- **ATS optimization**: a live score and checklist flag anything an applicant tracking system might miss.
- **One-click PDF export**: resumes and letters download as clean, print-ready PDFs with real selectable text (ATS-friendly, no screenshots).
- **Document library**: every draft is stored per user in Postgres and listed on your dashboard, with inline rename and delete (with a deletion reason) right from the card menu.
- **Auth flow**: sign-in and sign-up against the `users` table (bcrypt + JWT), per-user dashboards, and route protection for the dashboard.
- **Polished landing page**: subtle scroll animations, custom brand mark, and fully responsive layout.

## Tech stack

| Layer      | Technology |
| ---------- | ---------- |
| Framework  | Next.js 16 (App Router, Turbopack) |
| UI         | React 19, TypeScript |
| Styling    | Tailwind CSS v4, tw-animate-css |
| Components | shadcn/ui on Base UI |
| Auth       | Auth.js (next-auth v5) with Prisma adapter |
| Database   | PostgreSQL via Prisma 7 + `@prisma/adapter-pg` |

## Getting started

### Prerequisites

- Node.js 20 or newer
- PostgreSQL 15 or newer

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
  dashboard/         Dashboard, resumes list, resume builder
  page.tsx           Landing page
components/
  landing/           Landing page sections and auth dialog
  resume/            Resume builder and live preview
  letter/            Cover / application letter builder and live preview
  pdf/               react-pdf documents for resume and letter export
  ui/                shadcn/ui primitives (button, dialog, input, ...)
  sidebar.tsx        App sidebar (desktop rail + mobile drawer)
lib/
  resume-ai.ts      Rule-based resume conversation engine
  letter-ai.ts      Rule-based letter conversation engine
  documents.ts      Server fetchers for user resumes and letters
  resume.ts          Resume model and ATS scoring
  letter.ts          Letter model and scoring
  pdf.ts             Client-side PDF download helper
  prisma.ts          Prisma client (Postgres driver adapter)
prisma/schema.prisma Database schema
auth.ts              Auth.js configuration
```

## Status

- Auth uses Auth.js v5 with the Credentials provider; sign-up and sign-in verify against the `users` table and issue JWT sessions, with real per-user document storage in Postgres.
- Roles: users have a `role` column (`user` / `admin`) so admins can be distinguished from regular users.
- Resumes and letters are persisted per user in Postgres, listed on the dashboard, and support inline rename and delete (with a deletion reason) from each document card.
- PDF export runs fully client-side with vector text (via `@react-pdf/renderer`), so documents are parseable by ATS software without any backend.

## Roadmap

- [x] Landing page with animations and auth dialogs
- [x] Chat-driven resume builder with live ATS preview
- [x] Chat-driven cover and application letter builder with live preview
- [x] One-click ATS-friendly PDF export
- [x] Real credential verification and per-user dashboards
- [x] Persist documents per user (Prisma models + rename/delete with reason)
- [x] Users `role` column (`user` / `admin`) with admin area scaffold
- [ ] Generate resumes and letters with a real LLM provider

## License

This project is currently private. Reuse of the code or brand requires permission from the maintainer.