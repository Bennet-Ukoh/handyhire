import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getAdminNotificationCounts } from "@/lib/shared/notifications";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    redirect("/dashboard");
  }

  const counts = await getAdminNotificationCounts();
  const notificationCounts: Record<string, number> = {};
  if (counts.pendingVerifications > 0) {
    notificationCounts["/admin/verifications"] = counts.pendingVerifications;
  }

  return (
    <DashboardShell session={session} notificationCounts={notificationCounts}>
      {children}
    </DashboardShell>
  );
}
