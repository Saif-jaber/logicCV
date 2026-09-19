import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "./animated-number";
import { Reveal } from "./reveal";
import { AuthCta } from "./auth-cta";

const stats = [
  { value: 92, suffix: "/100", label: "average ATS score after one chat session" },
  { value: 5, suffix: " min", label: "from a blank page to a first draft" },
  { value: 100, suffix: "%", label: "chat-driven. no forms, no templates to fill" },
];

const steps = [
  {
    num: "01",
    title: "Answer quick questions",
    text: "Tell the assistant your name, role, and experience. No blank templates, no formatting.",
  },
  {
    num: "02",
    title: "Talk in plain words",
    text: "Refine anything naturally: \u201Cmake my summary more confident\u201D or \u201Cadd my latest project\u201D.",
  },
  {
    num: "03",
    title: "Ship an ATS-friendly CV or letter",
    text: "Watch the score climb as sections fill in, then export your polished PDF.",
  },
];

const features = [
  {
    kicker: "Live preview",
    title: "The document keeps up as you type",
    text: "The rendered resume sits beside your chat and updates with every message. Resumes and cover letters alike. You see the result take shape, not fields to fill.",
    proof: <LivePreviewProof />,
  },
  {
    kicker: "Built for ATS parsers",
    title: "A score you can watch climb",
    text: "Clean structure, standard section names, and a checklist that flags anything a system might miss. See 54 become 90 as you chat.",
    proof: <AtsProof />,
  },
  {
    kicker: "One-click export",
    title: "Resumes and letters, ready to send",
    text: "Build an ATS-ready CV or a tailored cover letter in one app, then get a clean print-ready PDF of either the moment you stop typing.",
    proof: <ExportProof />,
  },
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

function LivePreviewProof() {
  return (
    <div className="lp-proof">
      <div className="lp-proof__head">
        <span className="lp-proof__title">Live preview</span>
        <span className="font-code text-xs text-ink-2">0:12 → draft</span>
      </div>
      <div className="lp-proof__body lp-live">
        <p className="lp-doc-line">
          <span className="lp-doc-line__num">01</span>
          <span className="truncate">Joel Koyoo</span>
        </p>
        <p className="lp-doc-line">
          <span className="lp-doc-line__num">02</span>
          <span className="truncate text-ink-2">Frontend Developer · Nairobi</span>
        </p>
        <p className="lp-doc-line">
          <span className="lp-doc-line__num">03</span>
          <span>
            <span className="lp-doc-line__bar block w-[92%]" />
          </span>
        </p>
        <p className="lp-doc-line">
          <span className="lp-doc-line__num">04</span>
          <span>
            <span className="lp-doc-line__bar block w-[64%]" />
          </span>
        </p>
        <p className="lp-doc-line">
          <span className="lp-doc-line__num">05</span>
          <span>
            <span className="lp-doc-line__bar block w-[78%]" />
          </span>
        </p>
      </div>
    </div>
  );
}

function AtsProof() {
  const checks = [
    "Parsed name & contact",
    "Standard section headers",
    "Role verbs, no wasted words",
  ];
  return (
    <div className="lp-proof">
      <div className="lp-proof__head">
        <span className="lp-proof__title">ATS check</span>
        <span className="font-code text-xs text-ink-2">
          54 → <span className="text-cobalt">90</span>
        </span>
      </div>
      <div className="lp-proof__body">
        <div className="lp-score__row">
          <span>compat score</span>
          <span className="text-cobalt">+36</span>
        </div>
        <div className="lp-score__track">
          <div className="lp-score__fill" style={{ width: "90%" }} />
        </div>
        <div className="mt-4 border-t border-rule">
          {checks.map((c) => (
            <div key={c} className="lp-check">
              <span>{c}</span>
              <span className="lp-check__tick" aria-hidden>
                ✓
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExportProof() {
  return (
    <div className="lp-proof">
      <div className="lp-proof__head">
        <span className="lp-proof__title">Export</span>
        <Download className="size-4 text-cobalt" aria-hidden />
      </div>
      <div className="mt-2">
        <div className="lp-file">
          <span className="lp-file__name">resume-joel-koyoo.pdf</span>
          <span className="lp-file__status">PDF ready</span>
        </div>
        <div className="lp-file">
          <span className="lp-file__name">cover-letter-joel-koyoo.pdf</span>
          <span className="lp-file__status">PDF ready</span>
        </div>
      </div>
    </div>
  );
}

export function LandingSections() {
  return (
    <>
      <section className="lp-stats" aria-label="By the numbers">
        <div className="lp-container">
          <div className="lp-stats__grid">
            {stats.map((stat) => (
              <div key={stat.label} className="lp-stats__cell">
                <p className="lp-stats__value">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="lp-stats__label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="lp-band scroll-mt-24">
        <div className="lp-container">
          <div className="lp-band__head">
            <p className="lp-band__lead">How it works</p>
            <h2 className="lp-band__title">
              Three steps to a resume or letter you <em>actually like</em>
            </h2>
          </div>
          <div className="lp-steps">
            {steps.map((step, i) => (
              <Reveal key={step.num} delay={i * 90} className="h-full">
                <div className="lp-step h-full">
                  <p className="lp-step__num">{step.num}</p>
                  <h3 className="lp-step__title">{step.title}</h3>
                  <p className="lp-step__text">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-24">
        <div className="lp-container">
          {features.map((feature, i) => (
            <Reveal
              key={feature.title}
              delay={i * 90}
              className={cn("lp-feature", i % 2 === 1 && "lp-feature--flip")}
            >
              <div className="lp-feature__grid">
                <div>
                  <p className="lp-kicker lp-feature__label">
                    <span className="lp-hero__status-dot" aria-hidden />
                    {feature.kicker}
                  </p>
                  <h3 className="lp-feature__title">{feature.title}</h3>
                  <p className="lp-feature__text">{feature.text}</p>
                </div>
                <div>{feature.proof}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="wall-of-love" className="scroll-mt-24">
        <div className="lp-container">
          <div className="mb-8">
            <p className="lp-kicker">Wall of love</p>
            <h2 className="mt-2 font-display text-lg font-semibold tracking-tight text-ink lg:text-xl">
              People are talking their way to better resumes
            </h2>
          </div>
          <div className="lp-quotes">
            {quotes.map((quote, i) => (
              <Reveal
                key={quote.name}
                as="figure"
                delay={i * 80}
                className="lp-quote"
              >
                <blockquote className="lp-quote__text">{quote.text}</blockquote>
                <figcaption className="lp-quote__attrib">
                  {quote.name}, {quote.role.toLowerCase()}
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-cta-band">
        <div className="lp-container">
          <p className="lp-kicker">start free</p>
          <h2 className="lp-cta-band__title">
            Ready to talk your way to a better application?
          </h2>
          <div className="lp-cta-band__row">
            <AuthCta
              mode="signup"
              redirect="/dashboard/resumes/new"
              className="lp-cta lp-focus"
            >
              Start building
            </AuthCta>
            <p className="lp-hero__micro">
              <span>no account walls</span>
              <span>no credit card</span>
              <span>~5 minutes</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}