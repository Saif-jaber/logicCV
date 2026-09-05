"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthModal, type AuthMode } from "./auth-modal";

type AuthCtaProps = {
  mode?: AuthMode;
  redirect?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  className?: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;

export function AuthCta({
  mode = "signup",
  redirect,
  variant = "default",
  className,
  children,
  ...rest
}: AuthCtaProps) {
  const { open } = useAuthModal();
  return (
    <button
      type="button"
      onClick={() => open(mode, redirect)}
      className={cn(buttonVariants({ variant }), className)}
      {...rest}
    >
      {children}
    </button>
  );
}