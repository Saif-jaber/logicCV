"use server";

import { revalidatePath } from "next/cache";
import { auth, unstable_update } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";

export type SettingsFormState = {
  errors?: Record<string, string>;
  ok?: boolean;
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

export async function updateProfileAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { errors: { form: "Not signed in." } };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  const errors: Record<string, string> = {};
  if (name.length < 2) {
    errors.name = "Please enter your full name.";
  }
  if (!EMAIL_RE.test(email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (Object.keys(errors).length > 0) return { errors };

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== userId) {
      return {
        errors: { email: "An account with this email already exists." },
      };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });

    await unstable_update({ user: { name, email } });
  } catch (error) {
    console.error("updateProfile failed", error);
    return { errors: { form: "Something went wrong. Please try again." } };
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function changePasswordAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { errors: { form: "Not signed in." } };

  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  const errors: Record<string, string> = {};
  if (next.length > 128) {
    errors.newPassword = "Use at most 128 characters.";
  } else {
    const issue = passwordIssue(next);
    if (issue) errors.newPassword = issue;
  }
  if (confirm !== next) {
    errors.confirmPassword = "Passwords do not match.";
  }
  if (Object.keys(errors).length > 0) return { errors };

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });
    if (!user?.password) {
      return { errors: { form: "This account does not use a password." } };
    }
    const isValid = await verifyPassword(current, user.password);
    if (!isValid) {
      return {
        errors: { currentPassword: "Current password is incorrect." },
      };
    }
    await prisma.user.update({
      where: { id: userId },
      data: { password: await hashPassword(next) },
    });
  } catch (error) {
    console.error("changePassword failed", error);
    return { errors: { form: "Something went wrong. Please try again." } };
  }

  return { ok: true };
}