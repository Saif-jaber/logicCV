import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "logicCV",
    template: "%s | logicCV",
  },
  description:
    "Build a standout CV/resume by talking to an AI assistant. logicCV writes an ATS-friendly resume as you chat, with a live preview and export.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}