import { FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "./brand-mark";
import { AuthCta } from "./auth-cta";

const entrance = "animate-in fade-in ease-out fill-mode-both";

function ConversationCard() {
  return (
    <div className="lp-convo">
      <div className="lp-convo__head">
        <span className="lp-kicker" style={{ color: "var(--color-on-graphite-2)" }}>
          session log
        </span>
        <span className="lp-convo__chip">
          <FileText className="size-3" aria-hidden />
          ATS ready 92
        </span>
      </div>

      <div className="lp-convo__body">
        <div className="flex items-start gap-2.5">
          <BrandMark className="mt-1 size-6 shrink-0" />
          <div className="lp-bubble lp-bubble--ai">
            Hi, I&apos;m your LogicCV assistant. What&apos;s your full name and
            job title?
          </div>
        </div>
        <div className="flex justify-end">
          <div className="lp-bubble lp-bubble--user">Joel Koyoo, Frontend Developer</div>
        </div>
        <div className="flex items-start gap-2.5">
          <BrandMark className="mt-1 size-6 shrink-0" />
          <div className="lp-bubble lp-bubble--ai">
            Nice. Now your most recent role: company and title, like &quot;Product
            Manager at Google&quot;.
          </div>
        </div>
        <div className="lp-convo__typing" aria-hidden>
          <span className="lp-convo__dot" />
          <span className="lp-convo__dot" />
          <span className="lp-convo__dot" />
        </div>
      </div>

      <div className="lp-convo__foot">
        <span>3 messages</span>
        <span className="lp-convo__foot-sep" aria-hidden />
        <span>draft ready</span>
        <span className="lp-convo__foot-sep" aria-hidden />
        <span className="text-cobalt">export → PDF</span>
      </div>
    </div>
  );
}

export function LandingHero() {
  return (
    <section className="lp-hero">
      <div className="lp-container">
        <div className="lp-hero__grid">
          <div
            className={cn(entrance)}
            style={{ animationDuration: "650ms" }}
          >
            <p className="lp-kicker lp-hero__status">
              <span className="lp-hero__status-dot" aria-hidden />
              ATS checked
              <span aria-hidden style={{ opacity: 0.35 }}>·</span>
              resumes &amp; letters
              <span aria-hidden style={{ opacity: 0.35 }}>·</span>
              no templates to wrestle
            </p>

            <h1 className="lp-hero__title">
              Your next resume or cover letter starts with a{" "}
              <em>conversation</em>
            </h1>

            <p className="lp-hero__lead">
              LogicCV is an AI assistant that builds an ATS-friendly CV, resume,
              or cover letter while you chat. Answer a few questions, then
              fine-tune everything with plain words.
            </p>

            <div className="lp-hero__cta-row">
              <AuthCta
                mode="signup"
                redirect="/dashboard/resumes/new"
                className="lp-cta lp-focus"
              >
                <Sparkles className="size-4" aria-hidden />
                Build with AI
              </AuthCta>
              <AuthCta
                mode="signin"
                redirect="/dashboard"
                variant="ghost"
                className="lp-cta-ghost lp-focus"
              >
                Explore the app
              </AuthCta>
            </div>

            <p className="lp-hero__micro">
              <span>no credit card</span>
              <span>under five minutes</span>
              <span>unlimited edits</span>
            </p>
          </div>

          <div
            className={cn(entrance)}
            style={{ animationDuration: "900ms", animationDelay: "150ms" }}
          >
            <ConversationCard />
          </div>
        </div>
      </div>
    </section>
  );
}