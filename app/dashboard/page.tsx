import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardContent } from "@/components/dashboard-content";
import { fetchUserLetters, fetchUserResumes } from "@/lib/documents";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/sign-in");

  const [resumes, letters] = await Promise.all([
    fetchUserResumes(userId),
    fetchUserLetters(userId),
  ]);

  return <DashboardContent resumes={resumes} letters={letters} />;
}