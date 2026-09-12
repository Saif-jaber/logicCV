"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import {
  AuthForm,
  type AuthMode,
} from "@/components/auth/auth-form";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPanel,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";

export type { AuthMode } from "@/components/auth/auth-form";

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

function AuthFormDialogContent({
  mode,
  onSwitchMode,
}: {
  mode: AuthMode;
  onSwitchMode: () => void;
}) {
  const isSignup = mode === "signup";

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

      <AuthForm mode={mode} />

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

  const openModal = useCallback((nextMode: AuthMode) => {
    setMode(nextMode);
    setOpen(true);
  }, []);

  const contextValue = useMemo(() => ({ open: openModal }), [openModal]);

  return (
    <AuthModalContext.Provider value={contextValue}>
      {children}
      <Dialog open={open} onOpenChange={setOpen} dismissible={false}>
        <DialogPortal>
          <DialogBackdrop />
          <DialogPanel>
            <AuthFormDialogContent
              mode={mode}
              onSwitchMode={() =>
                setMode((m) => (m === "signin" ? "signup" : "signin"))
              }
            />
          </DialogPanel>
        </DialogPortal>
      </Dialog>
    </AuthModalContext.Provider>
  );
}