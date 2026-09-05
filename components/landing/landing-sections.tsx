import {
  ArrowRight,
  Eye,
  FileDown,
  MessageSquareText,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "./animated-number";
import { Reveal } from "./reveal";
import { AuthCta } from "./auth-cta";

const steps = [
  {
    number: "01",
    icon: MessagesSquare,
    title: "Answer quick questions",
    text: "Tell the assistant your name, role, and experience. No blank templates, no formatting.",
  },
  {
    number: "02",
    icon: MessageSquareText,
    title: "Talk in plain words",
    text: "Refine anything naturally: 'make my summary more confident' or 'add my latest project'.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Ship an ATS-friendly CV",
    text: "Watch the score climb as sections fill in, then export your polished PDF.",
  },
];

const features = [
  {
    icon: Eye,
    title: "Live preview with every message",
    text: "The resume renders beside your chat and updates the moment you type, so you always see the final result.",
  },
  {
    icon: ShieldCheck,
    title: "Built for ATS parsers",
    text: "Clean structure, standard section names, and a checklist that flags anything a system might miss.",
  },
  {
    icon: FileDown,
    title: "One-click PDF export",
    text: "When you are happy with the wording, get a clean, print-ready file you can send anywhere.",
  },
];

const stats = [
  { value: 92, suffix: "/100", label: "average ATS score after one chat session" },
  { value: 5, suffix: " min", label: "from a blank page to a first draft" },
  { value: 100, suffix: "%", label: "chat-driven. No forms, no templates to fill" },
];

const quotes = [
  {
    initials: "MR",
    name: "Maya R.",
    role: "Product Designer",
    text: "I described my summary out loud to the chat and it became the best version I have ever had.",
  },
  {
    initials: "DK",
    name: "Daniel K.",
    role: "Backend Engineer",
    text: "The ATS checklist caught things I never thought about. My score went from 54 to 90.",
  },
  {
    initials: "SL",
    name: "Sofia L.",
    role: "Marketing Manager",
    text: "From a blank page to a finished CV in the time it takes to finish one coffee.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Reveal>
        <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
      </Reveal>
      <Reveal delay={160}>
        <p className="mt-4 text-lg text-muted-foreground">{text}</p>
      </Reveal>
    </div>
  );
}

const cardHover =
  "transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-blue-950/5";

export function LandingSections() {
  return (
    <>
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="grid gap-0 overflow-hidden rounded-3xl border border-border bg-card shadow-sm md:grid-cols-3">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={cn(
                    "flex h-full flex-col items-center justify-center gap-1.5 px-6 py-9 text-center",
                    i > 0 &&
                      "border-t border-border md:border-t-0 md:border-l"
                  )}
                >
                  <p className="text-4xl font-bold tracking-tight text-foreground">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm leading-snug text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-28 px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="How it works"
            title="Three steps to a resume you actually like"
            text="No forms, no drag and drop. You just talk."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.number} delay={i * 120} className="h-full">
                <div className={cn("h-full rounded-2xl border border-border bg-card p-6", cardHover)}>
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <step.icon className="size-5" />
                    </span>
                    <span className="text-2xl font-bold tracking-tight text-foreground/10">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-28 bg-muted/40 px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Features"
            title="Everything a resume needs, nothing it doesn't"
            text="Focused on the one thing that matters: getting you hired."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 120} className="h-full">
                <div className={cn("h-full rounded-2xl border border-border bg-card p-6", cardHover)}>
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="wall-of-love" className="scroll-mt-28 px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Wall of love"
            title="People are talking their way to better resumes"
            text="Real words from early users who traded blank pages for conversations."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {quotes.map((quote, i) => (
              <Reveal key={quote.name} delay={i * 120} className="h-full">
                <figure className={cn("flex h-full flex-col rounded-2xl border border-border bg-card p-6", cardHover)}>
                  <blockquote className="flex-1 text-sm leading-relaxed text-foreground">
                    &ldquo;{quote.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {quote.initials}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-foreground">
                        {quote.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {quote.role}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-700 to-blue-900 px-6 py-16 text-center shadow-2xl shadow-blue-950/20 sm:py-20">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-white/10 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-28 -left-16 size-72 rounded-full bg-white/10 blur-3xl"
              />
              <h2 className="relative mx-auto max-w-2xl text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to talk your way to a better resume?
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
                Your first resume takes about five minutes. No account walls, no
                credit card.
              </p>
              <AuthCta
                mode="signup"
                redirect="/dashboard/resumes/new"
                variant="secondary"
                className="relative mt-8 h-11 cursor-pointer rounded-full px-6 text-base shadow-lg shadow-blue-950/30 transition-all duration-200 hover:shadow-xl"
              >
                Start building
                <ArrowRight className="size-4" />
              </AuthCta>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}