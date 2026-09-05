import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "logicCV - AI resume builder",
  description:
    "Build a standout CV/resume by talking to an AI assistant. logicCV writes an ATS-friendly resume as you chat, with a live preview and export.",
};

export default function Home() {
  return <LandingPage />;
}