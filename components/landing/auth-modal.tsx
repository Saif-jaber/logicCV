"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPanel,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";

export type AuthMode = "signin" | "signup";

type AuthModalContextValue = {
  open: (mode: AuthMode, redirect?: string) => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return context;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground" data-slot="label">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function AuthForm({
  mode,
  onSwitchMode,
  onSuccess,
}: {
  mode: AuthMode;
  onSwitchMode: () => void;
  onSuccess: () => void;
}) {
  const isSignup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (isSignup && !name.trim()) {
      next.name = "Please enter your full name.";
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      next.email = "Please enter a valid email address.";
    }
    if (password.length < (isSignup ? 6 : 1)) {
      next.password = isSignup
        ? "Use at least 6 characters."
        : "Please enter your password.";
    }
    setErrors(next);
    if (Object.keys(next).length === 0) {
      onSuccess();
    }
  };

  return (
    <>
      <div className="pr-8">
        <DialogTitle>
          {isSignup ? "Create your account" : "Welcome back"}
        </DialogTitle>
        <DialogDescription className="mt-1">
          {isSignup
            ? "Start building your resume in under five minutes."
            : "Sign in to pick up where you left off."}
        </DialogDescription>
      </div>

      <DialogClose className="absolute top-4 right-4 rounded-md p-1.5 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground">
        <X className="size-4" />
        <span className="sr-only">Close</span>
      </DialogClose>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        {isSignup && (
          <Field label="Full name" error={errors.name}>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Joel Koyoo"
              autoComplete="name"
              className="h-10"
              aria-invalid={!!errors.name}
            />
          </Field>
        )}

        <Field label="Email" error={errors.email}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="h-10"
            aria-invalid={!!errors.email}
          />
        </Field>

        <Field label="Password" error={errors.password}>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignup ? "At least 6 characters" : "Your password"}
              autoComplete={isSignup ? "new-password" : "current-password"}
              className="h-10 pr-10"
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded p-1 text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </Field>

        <Button
          type="submit"
          className="h-10 w-full cursor-pointer text-sm"
        >
          {isSignup ? "Create account" : "Sign in"}
        </Button>

        {isSignup && (
          <p className="text-xs text-muted-foreground">
            By creating an account you agree to the Terms of Service and
            Privacy Policy.
          </p>
        )}
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchMode}
              className="cursor-pointer font-medium text-primary hover:underline"
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            New to logicCV?{" "}
            <button
              type="button"
              onClick={onSwitchMode}
              className="cursor-pointer font-medium text-primary hover:underline"
            >
              Create an account
            </button>
          </>
        )}
      </p>
    </>
  );
}

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("signin");
  const [redirect, setRedirect] = useState("/dashboard");
  const router = useRouter();

  const openModal = useCallback((nextMode: AuthMode, nextRedirect?: string) => {
    setMode(nextMode);
    setRedirect(
      nextRedirect ??
        (nextMode === "signin" ? "/dashboard" : "/dashboard/resumes/new")
    );
    setOpen(true);
  }, []);

  const handleSuccess = useCallback(() => {
    setOpen(false);
    router.push(redirect);
  }, [router, redirect]);

  const contextValue = useMemo(() => ({ open: openModal }), [openModal]);

  return (
    <AuthModalContext.Provider value={contextValue}>
      {children}
      <Dialog open={open} onOpenChange={setOpen} dismissible={false}>
        <DialogPortal>
          <DialogBackdrop />
          <DialogPanel>
            <AuthForm
              mode={mode}
              onSwitchMode={() =>
                setMode((m) => (m === "signin" ? "signup" : "signin"))
              }
              onSuccess={handleSuccess}
            />
          </DialogPanel>
        </DialogPortal>
      </Dialog>
    </AuthModalContext.Provider>
  );
}