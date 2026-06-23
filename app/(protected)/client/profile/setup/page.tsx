import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { isClientProfileComplete } from "@/lib/client/profile-store";
import ProfileSetupForm from "@/components/client/ProfileSetupForm";

export const metadata: Metadata = { title: "Complete Your Profile — HandyHire" };

export default async function ProfileSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const session = await getSession();
  const { from } = await searchParams;

  if (isClientProfileComplete(session!.userId)) {
    redirect(from ?? "/client/dashboard");
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        <ProfileSetupForm from={from} />
      </div>
    </div>
  );
}
