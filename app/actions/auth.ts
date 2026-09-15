"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export type AuthFormState = {
  errors?: Record<string, string>;
} | undefined;

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const PASSWORD_MIN = 8;

function passwordIssue(password: string): string | null {
  if (password.length < PASSWORD_MIN) {
    return `Use at least ${PASSWORD_MIN} characters.`;
  }
  if (!/[A-Z]/.test(password)) {
    return "Add at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Add at least one lowercase letter.";
  }
  if (!/\d/.test(password)) {
    return "Add at least one number.";
  }
  return null;
}

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const errors: Record<string, string> = {};
  if (name.trim().length < 2) {
    errors.name = "Please enter your full name.";
  }
  if (!EMAIL_RE.test(email)) {
    errors.email = "Please enter a valid email address.";
  }
  const pwIssue = passwordIssue(password);
  if (password.length > 128) {
    errors.password = "Use at most 128 characters.";
  } else if (pwIssue) {
    errors.password = pwIssue;
  }
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { errors: { email: "An account with this email already exists." } };
    }

    await prisma.user.create({
      data: {
        name: name.trim(),
        email,
        password: await hashPassword(password),
      },
    });

    try {
      await signIn("credentials", { email, password, redirect: false });
    } catch (error) {
      if (error instanceof AuthError) {
        return {
          errors: {
            form: "Account created, but sign-in failed. Please sign in instead.",
          },
        };
      }
      throw error;
    }
  } catch (error) {
    console.error("signUp failed", error);
    return { errors: { form: "Something went wrong. Please try again." } };
  }

  redirect("/dashboard");
}

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return { errors: { form: "Invalid email or password." } };
    }
    console.error("signIn failed", error);
    return { errors: { form: "Something went wrong. Please try again." } };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });
  redirect(user?.role === "admin" ? "/admin" : "/dashboard");
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirect: true, redirectTo: "/" });
}