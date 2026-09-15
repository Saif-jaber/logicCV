import Link from "next/link";
import { ArrowRight, ScrollText, ShieldCheck, UsersRound } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { SignupsChart, type SignupPoint } from "@/components/admin/signups-chart";
import { StatCard } from "@/components/admin/stat-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Admin Overview",
};

const DAY_WINDOW = 14;

function getDayStart(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getInitials(name: string | null, email: string | null): string {
  const value = name?.trim();
  if (value) {
    const parts = value.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
  }
  return email?.[0]?.toUpperCase() ?? "?";
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(iso)
  );
}

function dayLabel(date: Date): string {
  return date.toLocaleString("en-US", { month: "short", day: "numeric" });
}

export default async function AdminOverviewPage() {
  const today = new Date();
  const signupsWindowStart = getDayStart(today);
  signupsWindowStart.setDate(signupsWindowStart.getDate() - (DAY_WINDOW - 1));

  const weekStart = getDayStart(today);
  weekStart.setDate(weekStart.getDate() - 7);
  const previousWeekStart = getDayStart(weekStart);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);

  const deletionsWindowStart = getDayStart(today);
  deletionsWindowStart.setDate(deletionsWindowStart.getDate() - DAY_WINDOW);
  const deletionsPreviousWindowStart = getDayStart(deletionsWindowStart);
  deletionsPreviousWindowStart.setDate(
    deletionsPreviousWindowStart.getDate() - DAY_WINDOW
  );

  const [
    totalUsers,
    totalAdmins,
    signupsWeek,
    signupsPreviousWeek,
    recentSignupRows,
    recentDeletionRows,
    countByDay,
    deletionsWindow,
    deletionsPreviousWindow,
    totalDeletions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "admin" } }),
    prisma.user.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.user.count({
      where: { createdAt: { gte: previousWeekStart, lt: weekStart } },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
    prisma.userDeletion.findMany({
      orderBy: { deletedAt: "desc" },
      take: 3,
      select: {
        id: true,
        email: true,
        reason: true,
        deletedByEmail: true,
        deletedAt: true,
      },
    }),
    prisma.user
      .findMany({
        where: { createdAt: { gte: signupsWindowStart } },
        select: { createdAt: true },
      })
      .then((rows) => {
        const counts = new Map<string, number>();
        for (const row of rows) {
          const key = row.createdAt.toDateString();
          counts.set(key, (counts.get(key) ?? 0) + 1);
        }
        return counts;
      }),
    prisma.userDeletion.count({
      where: { deletedAt: { gte: deletionsWindowStart } },
    }),
    prisma.userDeletion.count({
      where: {
        deletedAt: {
          gte: deletionsPreviousWindowStart,
          lt: deletionsWindowStart,
        },
      },
    }),
    prisma.userDeletion.count(),
  ]);

  const signupPoints: SignupPoint[] = [];
  for (let i = DAY_WINDOW - 1; i >= 0; i--) {
    const day = getDayStart(today);
    day.setDate(day.getDate() - i);
    signupPoints.push({
      label: dayLabel(day),
      count: countByDay.get(day.toDateString()) ?? 0,
    });
  }

  const totalSignups = signupPoints.reduce((sum, point) => sum + point.count, 0);
  const signupsDiff = signupsWeek - signupsPreviousWeek;
  const deletionsDiff = deletionsWindow - deletionsPreviousWindow;

  const recentUsers = recentSignupRows.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    joinedAt: user.createdAt.toISOString(),
  }));

  const recentDeletions = recentDeletionRows.map((deletion) => ({
    id: deletion.id,
    email: deletion.email,
    reason: deletion.reason,
    deletedByEmail: deletion.deletedByEmail,
    deletedAt: deletion.deletedAt.toISOString(),
  }));

  return (
    <>
      <AdminHeader title="Overview" description="Platform health at a glance.">
        <Link
          href="/admin/users"
          className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
        >
          Manage users
          <ArrowRight />
        </Link>
      </AdminHeader>

      <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard
          label="Total users"
          value={totalUsers}
          icon={UsersRound}
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300"
          trend={{
            direction: signupsDiff >= 0 ? "up" : "down",
            label: `${signupsDiff >= 0 ? "+" : ""}${signupsDiff} this week`,
          }}
        />
        <StatCard
          label="Admins"
          value={totalAdmins}
          icon={ShieldCheck}
          iconClassName="bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"
        />
        <StatCard
          label="Deletions (14 days)"
          value={deletionsWindow}
          icon={ScrollText}
          iconClassName="bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300"
          trend={{
            direction: deletionsDiff <= 0 ? "down" : "up",
            label: `${deletionsDiff >= 0 ? "+" : ""}${deletionsDiff} vs previous period`,
          }}
        />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>New signups</CardTitle>
            <CardDescription>
              Daily account creation over the last 14 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupsChart data={signupPoints} total={String(totalSignups)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>At a glance</CardTitle>
            <CardDescription>Current platform totals</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <UsersRound className="size-4" />
                Total users
              </span>
              <span className="font-semibold text-foreground">
                {totalUsers}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="size-4" />
                Administrators
              </span>
              <span className="font-semibold text-foreground">
                {totalAdmins}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <ScrollText className="size-4" />
                Accounts deleted
              </span>
              <span className="font-semibold text-foreground">
                {totalDeletions}
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent signups</CardTitle>
            <CardAction>
              <Link
                href="/admin/users"
                className="text-sm font-medium text-primary hover:underline"
              >
                View all
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0"
              >
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback className="bg-blue-100 text-xs font-semibold text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                    {getInitials(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {user.name || user.email}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email} &middot; {formatDate(user.joinedAt)}
                  </p>
                </div>
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                  className="rounded-full"
                >
                  {user.role}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest deletions</CardTitle>
            <CardAction>
              <Link
                href="/admin/deletions"
                className="text-sm font-medium text-primary hover:underline"
              >
                View log
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {recentDeletions.map((deletion) => (
              <div
                key={deletion.id}
                className="flex items-center gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
                  <ScrollText className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {deletion.email}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {deletion.reason} &middot; {formatDate(deletion.deletedAt)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
}