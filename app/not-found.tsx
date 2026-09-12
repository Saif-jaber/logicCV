import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BrandMark } from "@/components/landing/brand-mark";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-x-clip bg-background px-4 text-center text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(58%_55%_at_50%_0%,rgba(37,99,235,0.09),transparent)]" />
        <div className="absolute inset-x-0 top-0 h-[420px] bg-dots [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      </div>

      <div className="flex animate-in flex-col items-center gap-6 fade-in slide-in-from-bottom-3 ease-out fill-mode-both">
        <BrandMark className="size-12 shrink-0" />

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            404
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Page not found
          </h1>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            The link you followed may be expired, broken, or the page may have
            moved.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "h-10 cursor-pointer rounded-full px-5 shadow-sm transition-shadow duration-200 hover:shadow-md hover:shadow-primary/20"
            )}
          >
            Back to home
          </Link>
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-10 cursor-pointer rounded-full px-5"
            )}
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}