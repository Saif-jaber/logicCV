"use client";

import { useActionState } from "react";
import { Check, LoaderCircle, User } from "lucide-react";
import {
  changePasswordAction,
  updateProfileAction,
} from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SettingsUser = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  createdAt?: string | null;
};

function Saved() {
  return (
    <span className="inline-flex items-center gap-1.5 font-code text-xs text-success">
      <Check className="size-3.5" />
      Saved
    </span>
  );
}

function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger"
    >
      {message}
    </p>
  );
}

function Section({
  title,
  meta,
  children,
  id,
}: {
  title: string;
  meta: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section className="db-panel" id={id}>
      <div className="db-panel__head">
        <h2 className="db-panel__title">{title}</h2>
        <span className="db-panel__meta">{meta}</span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

function ProfileForm({ user }: { user: SettingsUser }) {
  const [state, action, pending] = useActionState(updateProfileAction, undefined);
  const errors = state?.errors ?? {};

  return (
    <form action={action} className="space-y-4" noValidate>
      <FormError message={errors.form} />
      {state?.ok && <Saved />}

      <div className="space-y-1.5">
        <label
          htmlFor="settings-name"
          className="db-label-mono uppercase tracking-[0.04em]"
        >
          Full name
        </label>
        <Input
          id="settings-name"
          name="name"
          defaultValue={user.name ?? ""}
          minLength={2}
          autoComplete="name"
          className="h-9 pl-2.5"
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-xs text-danger" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="settings-email"
          className="db-label-mono uppercase tracking-[0.04em]"
        >
          Email
        </label>
        <Input
          id="settings-email"
          type="email"
          name="email"
          defaultValue={user.email ?? ""}
          maxLength={254}
          autoComplete="email"
          className="h-9 pl-2.5"
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-xs text-danger" role="alert">
            {errors.email}
          </p>
        )}
        <p className="text-xs text-foreground/60">
          This is also the address you sign in with.
        </p>
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="h-9 cursor-pointer text-sm"
      >
        {pending && <LoaderCircle className="size-4 animate-spin" />}
        {state?.ok ? "Saved" : "Save changes"}
      </Button>
    </form>
  );
}

function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, undefined);
  const errors = state?.errors ?? {};

  return (
    <form action={action} className="space-y-4" noValidate>
      <FormError message={errors.form} />
      {state?.ok && <Saved />}

      <div className="space-y-1.5">
        <label
          htmlFor="settings-current"
          className="db-label-mono uppercase tracking-[0.04em]"
        >
          Current password
        </label>
        <Input
          id="settings-current"
          type="password"
          name="currentPassword"
          autoComplete="current-password"
          className="h-9 pl-2.5"
          aria-invalid={!!errors.currentPassword}
        />
        {errors.currentPassword && (
          <p className="text-xs text-danger" role="alert">
            {errors.currentPassword}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="settings-new"
          className="db-label-mono uppercase tracking-[0.04em]"
        >
          New password
        </label>
        <Input
          id="settings-new"
          type="password"
          name="newPassword"
          autoComplete="new-password"
          className="h-9 pl-2.5"
          aria-invalid={!!errors.newPassword}
        />
        {errors.newPassword && (
          <p className="text-xs text-danger" role="alert">
            {errors.newPassword}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="settings-confirm"
          className="db-label-mono uppercase tracking-[0.04em]"
        >
          Confirm new password
        </label>
        <Input
          id="settings-confirm"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          className="h-9 pl-2.5"
          aria-invalid={!!errors.confirmPassword}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-danger" role="alert">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="h-9 cursor-pointer text-sm"
      >
        {pending && <LoaderCircle className="size-4 animate-spin" />}
        {state?.ok ? "Updated" : "Update password"}
      </Button>
    </form>
  );
}

export function SettingsClient({ user }: { user: SettingsUser }) {
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <Section title="Profile" meta="name + email">
          <ProfileForm user={user} />
        </Section>
        <Section title="Password" meta="sign-in">
          <PasswordForm />
        </Section>
      </div>

      <div className="space-y-4">
        <Section title="Account" meta="details">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between gap-3">
              <span className="db-label-mono uppercase tracking-[0.04em]">
                Role
              </span>
              <span className="db-chip db-chip--muted">
                {user.role === "admin" ? "Admin" : "User"}
              </span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="db-label-mono uppercase tracking-[0.04em]">
                Member since
              </span>
              <span className="text-foreground/80">{memberSince ?? "Unknown"}</span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="db-label-mono uppercase tracking-[0.04em]">
                Signed in as
              </span>
              <span className="inline-flex max-w-[60%] items-center gap-2 truncate text-foreground/80">
                <User className="size-4 shrink-0 text-foreground/50" />
                <span className="truncate">{user.email ?? "Unknown"}</span>
              </span>
            </li>
          </ul>
        </Section>
      </div>
    </div>
  );
}