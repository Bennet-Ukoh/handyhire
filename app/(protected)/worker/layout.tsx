import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getWorkerNotificationCounts } from "@/lib/shared/notifications";

export default async function WorkerLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== "worker") {
    redirect("/dashboard");
  }

  const counts = await getWorkerNotificationCounts(session.userId);
  const notificationCounts: Record<string, number> = {};
  if (counts.unreadChats > 0) notificationCounts["/chat"] = counts.unreadChats;

  return (
    <DashboardShell session={session} notificationCounts={notificationCounts}>
      {children}
    </DashboardShell>
  );
}
