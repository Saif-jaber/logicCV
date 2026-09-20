import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "logicCV",
    template: "%s | logicCV",
  },
  description:
    "Build a standout CV/resume by talking to an AI assistant. logicCV writes an ATS-friendly resume as you chat, with a live preview and export.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} scroll-smooth h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}