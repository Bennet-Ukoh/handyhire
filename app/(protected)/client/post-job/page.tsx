import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { isClientProfileComplete } from "@/lib/client/profile-store";
import PostJobForm from "@/components/client/PostJobForm";

export const metadata: Metadata = { title: "Post a Job — HandyHire" };

export default async function PostJobPage() {
  const session = await getSession();
  if (!isClientProfileComplete(session!.userId)) {
    redirect("/client/profile/setup?from=/client/post-job");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-7">
        <h1 className="font-display text-2xl md:text-3xl text-stone-900">Post a new job</h1>
        <p className="text-sm text-stone-500 mt-1">
          Describe the work — verified tradespeople near you will send quotes.
        </p>
      </div>
      <PostJobForm />
    </div>
  );
}
