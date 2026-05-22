import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function ChatLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/auth/signin");
  if (session.role === "admin") redirect("/admin/dashboard");

  return <DashboardShell session={session}>{children}</DashboardShell>;
}
