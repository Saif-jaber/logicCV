"use client";

import { useActionState, useState, type ReactNode } from "react";
import { Eye, EyeOff, Inbox, KeyRound, LoaderCircle, User } from "lucide-react";
import { signInAction, signUpAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type AuthMode = "signin" | "signup";

function Field({
  label,
  error,
  children,
  icon,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  icon: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={label.toLowerCase().replace(/\s+/g, "-")}
        className="text-sm font-medium text-foreground"
        data-slot="label"
      >
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground/70">
          {icon}
        </span>
        {children}
      </div>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const inputIconClasses = "size-4";

export function AuthForm({
  mode,
  className,
}: {
  mode: AuthMode;
  className?: string;
}) {
  const isSignup = mode === "signup";
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [state, action, pending] = useActionState(
    isSignup ? signUpAction : signInAction,
    undefined
  );
  const errors = state?.errors ?? {};

  return (
    <form action={action} className={cn("mt-6 space-y-4", className)} noValidate>
      {errors.form && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {errors.form}
        </div>
      )}

      {isSignup && (
        <Field label="Full name" error={errors.name} icon={<User className={inputIconClasses} />}>
          <Input
            id="full-name"
            name="name"
            placeholder="Joel Koyoo"
            autoComplete="name"
            minLength={2}
            className="h-10 pl-9"
            aria-invalid={!!errors.name}
          />
        </Field>
      )}

      <Field label="Email" error={errors.email} icon={<Inbox className={inputIconClasses} />}>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          maxLength={254}
          className="h-10 pl-9"
          aria-invalid={!!errors.email}
        />
      </Field>

      <Field label="Password" error={errors.password} icon={<KeyRound className={inputIconClasses} />}>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isSignup ? "8+ chars, upper, lowercase & number" : "Your password"}
          autoComplete={isSignup ? "new-password" : "current-password"}
          minLength={isSignup ? 8 : 1}
          className="h-10 pr-10 pl-9"
          aria-invalid={!!errors.password}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </Field>

      <Button
        type="submit"
        disabled={pending}
        className="h-10 w-full cursor-pointer text-sm"
      >
        {pending && <LoaderCircle className="size-4 animate-spin" />}
        {isSignup ? "Create account" : "Sign in"}
      </Button>

      {isSignup && (
        <p className="text-xs text-muted-foreground">
          By creating an account you agree to the Terms of Service and Privacy
          Policy.
        </p>
      )}
    </form>
  );
}