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

export const metadata = {
  title: "Admin Overview",
};

const demoSignups: SignupPoint[] = [
  { label: "Sep 1", count: 12 },
  { label: "Sep 2", count: 19 },
  { label: "Sep 3", count: 15 },
  { label: "Sep 4", count: 24 },
  { label: "Sep 5", count: 9 },
  { label: "Sep 6", count: 21 },
  { label: "Sep 7", count: 33 },
  { label: "Sep 8", count: 18 },
  { label: "Sep 9", count: 27 },
  { label: "Sep 10", count: 14 },
  { label: "Sep 11", count: 22 },
  { label: "Sep 12", count: 31 },
  { label: "Sep 13", count: 26 },
  { label: "Sep 14", count: 17 },
];

const demoRecentUsers: {
  id: string;
  name: string | null;
  email: string | null;
  role: "user" | "admin";
  joinedAt: string;
}[] = [
  {
    id: "u1",
    name: "Sarah Kim",
    email: "sarah@example.com",
    role: "user",
    joinedAt: "2026-09-14T09:41:00Z",
  },
  {
    id: "u2",
    name: "Miguel Alvarez",
    email: "miguel@example.com",
    role: "user",
    joinedAt: "2026-09-14T08:12:00Z",
  },
  {
    id: "u3",
    name: "Daniel Chen",
    email: "daniel@example.com",
    role: "user",
    joinedAt: "2026-09-13T22:03:00Z",
  },
  {
    id: "u4",
    name: "Amara Osei",
    email: "amara@example.com",
    role: "user",
    joinedAt: "2026-09-13T18:47:00Z",
  },
  {
    id: "u5",
    name: "Leo Fischer",
    email: "leo@example.com",
    role: "admin",
    joinedAt: "2026-09-13T11:29:00Z",
  },
];

const demoRecentDeletions: {
  id: string;
  email: string;
  reason: string;
  deletedByEmail: string;
  deletedAt: string;
}[] = [
  {
    id: "d1",
    email: "old.account@example.com",
    reason: "No longer needs the service",
    deletedByEmail: "old.account@example.com",
    deletedAt: "2026-09-13T16:20:00Z",
  },
  {
    id: "d2",
    email: "spam.user@example.com",
    reason: "Policy violation",
    deletedByEmail: "admin@logiccv.app",
    deletedAt: "2026-09-12T10:05:00Z",
  },
  {
    id: "d3",
    email: "test.temp@example.com",
    reason: "Duplicate account",
    deletedByEmail: "test.temp@example.com",
    deletedAt: "2026-09-10T14:38:00Z",
  },
];

const demoStats = {
  users: 284,
  admins: 3,
  deletions: 12,
};

const totalSignups = demoSignups.reduce((sum, d) => sum + d.count, 0);

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

export default function AdminOverviewPage() {
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
          value={demoStats.users}
          icon={UsersRound}
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300"
          trend={{ direction: "up", label: "+12 this week" }}
        />
        <StatCard
          label="Admins"
          value={demoStats.admins}
          icon={ShieldCheck}
          iconClassName="bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"
        />
        <StatCard
          label="Deletions (14 days)"
          value={demoStats.deletions}
          icon={ScrollText}
          iconClassName="bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300"
          trend={{ direction: "down", label: "-3 vs last period" }}
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
            <SignupsChart data={demoSignups} total={String(totalSignups)} />
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
                {demoStats.users}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="size-4" />
                Administrators
              </span>
              <span className="font-semibold text-foreground">
                {demoStats.admins}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <ScrollText className="size-4" />
                Accounts deleted
              </span>
              <span className="font-semibold text-foreground">
                {demoStats.deletions}
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
            {demoRecentUsers.map((user) => (
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
            {demoRecentDeletions.map((deletion) => (
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