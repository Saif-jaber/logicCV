import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SettingsClient } from "@/components/settings/settings-client";

export const metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true, createdAt: true },
  });
  if (!user) redirect("/sign-in");

  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      <header>
        <span className="db-kicker">Account</span>
        <h1 className="db-title">Settings</h1>
        <p className="db-lede">Manage your profile and account details.</p>
      </header>

      <div className="mt-6">
        <SettingsClient
          user={{
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
          }}
        />
      </div>
    </main>
  );
}