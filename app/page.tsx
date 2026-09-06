import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "logicCV - AI resume & cover letter builder",
  description:
    "Build a standout CV, resume, or cover letter by talking to an AI assistant. logicCV writes ATS-friendly documents as you chat, with live previews and PDF export.",
};

export default function Home() {
  return <LandingPage />;
}