import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getClientNotificationCounts } from "@/lib/shared/notifications";

export default async function ClientLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== "client") {
    redirect("/dashboard");
  }

  const counts = await getClientNotificationCounts(session.userId);
  const notificationCounts: Record<string, number> = {};
  if (counts.pendingQuotes > 0) notificationCounts["/client/dashboard"] = counts.pendingQuotes;
  if (counts.unreadChats > 0)   notificationCounts["/chat"] = counts.unreadChats;

  return (
    <DashboardShell session={session} notificationCounts={notificationCounts}>
      {children}
    </DashboardShell>
  );
}
