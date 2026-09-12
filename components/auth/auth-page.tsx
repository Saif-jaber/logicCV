import Link from "next/link";
import { AuthForm, type AuthMode } from "@/components/auth/auth-form";
import { BrandMark } from "@/components/landing/brand-mark";

export function AuthPage({ mode }: { mode: AuthMode }) {
  const isSignup = mode === "signup";

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <Link href="/" aria-label="logicCV home" className="cursor-pointer">
            <BrandMark className="h-12 w-auto transition-transform duration-200 hover:scale-105" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isSignup
                ? "Start building your resume in under five minutes."
                : "Sign in to pick up where you left off."}
            </p>
          </div>
        </div>

        <AuthForm mode={mode} />

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </>
          ) : (
            <>
              New to logicCV?{" "}
              <Link
                href="/sign-up"
                className="font-medium text-primary hover:underline"
              >
                Create an account
              </Link>
            </>
          )}
        </p>
      </div>
    </main>
  );
}