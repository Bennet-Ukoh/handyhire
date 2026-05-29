import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import DashboardShell from "@/components/dashboard/DashboardShell";
import {
  getWorkerNotificationCounts,
  getClientNotificationCounts,
} from "@/lib/shared/notifications";

export default async function ChatLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/auth/signin");
  if (session.role === "admin") redirect("/admin/dashboard");

  const notificationCounts: Record<string, number> = {};

  if (session.role === "worker") {
    const counts = await getWorkerNotificationCounts(session.userId);
    if (counts.unreadChats > 0) notificationCounts["/chat"] = counts.unreadChats;
  } else {
    const counts = await getClientNotificationCounts(session.userId);
    if (counts.pendingQuotes > 0) notificationCounts["/client/dashboard"] = counts.pendingQuotes;
    if (counts.unreadChats > 0)   notificationCounts["/chat"] = counts.unreadChats;
  }

  return (
    <DashboardShell session={session} notificationCounts={notificationCounts}>
      {children}
    </DashboardShell>
  );
}
