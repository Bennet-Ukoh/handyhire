import type { Metadata } from "next";
import { getSession } from "@/lib/auth/session";
import { getWorkerProfile } from "@/lib/worker/service";
import BrowseJobsView from "@/components/worker/BrowseJobsView";

export const metadata: Metadata = { title: "Browse Jobs — HandyHire" };

export default async function WorkerJobsPage() {
  const session = await getSession();
  const profile = await getWorkerProfile(session!.userId);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-stone-900 leading-tight">
            Browse Jobs
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            {profile.trade
              ? `${profile.trade} jobs near you — click Quote to send your offer.`
              : "Open jobs near you — click Quote to send your offer."}
          </p>
        </div>
        {profile.nearbyJobs.length > 0 && (
          <span className="text-sm text-stone-400 mt-1.5">
            {profile.nearbyJobs.length} job{profile.nearbyJobs.length !== 1 ? "s" : ""} available
          </span>
        )}
      </div>

      <BrowseJobsView jobs={profile.nearbyJobs} trade={profile.trade} />
    </div>
  );
}
