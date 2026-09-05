import { FileCheck2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "./brand-mark";
import { AuthCta } from "./auth-cta";

const entrance = "animate-in fade-in slide-in-from-bottom-3 ease-out fill-mode-both";

function PreviewMiniResume() {
  return (
    <div className="rounded-xl border border-border bg-background p-4 text-[11px] leading-relaxed">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-foreground">Joel Koyoo</p>
          <p className="text-muted-foreground">Frontend Developer</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-green-600/20 bg-green-600/10 px-2 py-0.5 text-[10px] font-semibold text-green-700">
          <FileCheck2 className="size-3" />
          ATS ready 92
        </span>
      </div>
      <p className="mt-3 text-muted-foreground">joel@koyoo.dev &middot; Nairobi</p>
      <div className="mt-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Summary
        </p>
        <p className="mt-1 text-muted-foreground">
          Frontend developer who ships accessible, fast interfaces and turns
          messy requirements into clean components.
        </p>
      </div>
      <div className="mt-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Experience
        </p>
        <p className="mt-1 font-medium text-foreground">Product Manager at Google</p>
        <ul className="mt-1 list-disc space-y-0.5 pl-3.5 text-muted-foreground">
          <li>Shipped a redesign that lifted activation by 18%.</li>
          <li>Led a team of 6 across design and engineering.</li>
        </ul>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {["TypeScript", "React", "Next.js", "Figma"].map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function MockChat() {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2.5">
        <BrandMark className="mt-0.5 size-7 shrink-0 rounded-lg" />
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-card px-3.5 py-2.5 text-sm text-foreground shadow-sm">
          Hi, I&apos;m your LogicCV assistant. What&apos;s your full name and job
          title?
        </div>
      </div>
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2.5 text-sm text-primary-foreground shadow-sm shadow-primary/20">
          Joel Koyoo, Frontend Developer
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <BrandMark className="mt-0.5 size-7 shrink-0 rounded-lg" />
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-card px-3.5 py-2.5 text-sm text-foreground shadow-sm">
          Nice. Now your most recent role: company and title, like &quot;Product
          Manager at Google&quot;.
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <BrandMark className="mt-0.5 size-7 shrink-0 rounded-lg" />
        <div
          className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3"
          aria-hidden
        >
          <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground/50" />
          <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground/50 [animation-delay:120ms]" />
          <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground/50 [animation-delay:240ms]" />
        </div>
      </div>
    </div>
  );
}

export function LandingHero() {
  return (
    <section className="relative isolate overflow-x-clip px-4 pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(58%_55%_at_50%_0%,rgba(37,99,235,0.09),transparent)]" />
        <div className="absolute inset-x-0 top-0 h-[420px] bg-dots [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -right-40 top-40 size-[460px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.08),transparent_65%)] blur-2xl" />
        <div className="absolute -left-40 top-96 size-[460px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.06),transparent_65%)] blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className={entrance}
            style={{ animationDuration: "650ms" }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3" />
              AI resume builder, free while in beta
            </span>
          </div>

          <h1
            className={cn(
              entrance,
              "mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            )}
            style={{ animationDuration: "700ms", animationDelay: "120ms" }}
          >
            Your next resume starts with a{" "}
            <span className="bg-gradient-to-r from-blue-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
              conversation
            </span>
          </h1>

          <p
            className={cn(
              entrance,
              "mx-auto mt-5 max-w-xl text-lg text-muted-foreground"
            )}
            style={{ animationDuration: "700ms", animationDelay: "240ms" }}
          >
            LogicCV is an AI assistant that builds an ATS-friendly CV while you
            chat. Answer a few questions, then fine-tune everything with plain
            words.
          </p>

          <div
            className={cn(
              entrance,
              "mt-8 flex flex-wrap items-center justify-center gap-3"
            )}
            style={{ animationDuration: "700ms", animationDelay: "360ms" }}
          >
            <AuthCta
              mode="signup"
              redirect="/dashboard/resumes/new"
              variant="default"
              className="h-11 cursor-pointer rounded-full px-6 text-base shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
            >
              <Sparkles className="size-4" />
              Build with AI
            </AuthCta>
            <AuthCta
              mode="signin"
              redirect="/dashboard"
              variant="outline"
              className="h-11 cursor-pointer rounded-full px-6 text-base"
            >
              Explore the app
            </AuthCta>
          </div>

          <p
            className={cn(entrance, "mt-4 text-sm text-muted-foreground")}
            style={{ animationDuration: "700ms", animationDelay: "480ms" }}
          >
            ATS checked <span className="text-foreground/30">&middot;</span>{" "}
            live preview <span className="text-foreground/30">&middot;</span>{" "}
            no templates to wrestle
          </p>
        </div>

        <div
          className={cn(entrance, "relative mx-auto mt-16 max-w-4xl")}
          style={{ animationDuration: "900ms", animationDelay: "560ms" }}
        >
          <div
            aria-hidden
            className="absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-r from-primary/15 via-primary/5 to-sky-400/15 blur-2xl"
          />
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-blue-950/10">
            <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-4 py-3">
              <span className="size-2.5 rounded-full bg-foreground/10" />
              <span className="size-2.5 rounded-full bg-foreground/10" />
              <span className="size-2.5 rounded-full bg-foreground/10" />
              <span className="ml-3 hidden text-xs font-medium text-muted-foreground sm:block">
                logiccv.app &middot; resume builder
              </span>
            </div>
            <div className="grid gap-6 p-5 sm:p-8 md:grid-cols-5">
              <div className="md:col-span-3">
                <MockChat />
              </div>
              <div className="hidden md:col-span-2 md:block">
                <PreviewMiniResume />
              </div>
            </div>
          </div>

          <div
            aria-hidden
            className="absolute -top-7 -right-3 hidden animate-[float_7s_ease-in-out_infinite] items-center gap-2.5 rounded-2xl border border-border bg-card px-3.5 py-2.5 shadow-lg lg:flex"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="size-3.5" />
            </span>
            <span>
              <span className="block text-xs font-semibold text-foreground">
                In the chat
              </span>
              <span className="block text-[11px] text-muted-foreground">
                No forms to fill
              </span>
            </span>
          </div>
          <div
            aria-hidden
            className="absolute -bottom-6 -left-3 hidden animate-[float_7s_ease-in-out_infinite] items-center gap-2.5 rounded-2xl border border-border bg-card px-3.5 py-2.5 shadow-lg [animation-delay:1.4s] lg:flex"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-green-600/10 text-green-700">
              <FileCheck2 className="size-3.5" />
            </span>
            <span>
              <span className="block text-xs font-semibold text-foreground">
                ATS ready
              </span>
              <span className="block text-[11px] text-muted-foreground">
                Score of 92
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}