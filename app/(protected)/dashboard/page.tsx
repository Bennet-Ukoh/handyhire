import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ROLE_REDIRECTS } from "@/lib/auth/types";

/* Role router — sends each user to their own dashboard */
export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/auth/signin");
  redirect(ROLE_REDIRECTS[session.role]);
}
