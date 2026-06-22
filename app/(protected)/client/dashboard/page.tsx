import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getClientProfile } from "@/lib/client/service";
import ClientStatsRow from "@/components/client/ClientStatsRow";
import JobsPanel from "@/components/client/JobsPanel";
import QuotesInbox from "@/components/client/QuotesInbox";
import ProfileIncompleteBanner from "@/components/client/ProfileIncompleteBanner";

export const metadata: Metadata = { title: "Client Dashboard — HandyHire" };

/* ── Section heading ────────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-3">
      {children}
    </p>
  );
}

/* ── New client empty state ─────────────────────────────────────────── */

function PostJobPrompt() {
  return (
    <div
      className="rounded-2xl py-12 px-8 md:px-12 flex flex-col items-center text-center"
      style={{
        background: "rgba(217,119,6,0.03)",
        border: "1.5px dashed rgba(217,119,6,0.22)",
      }}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "rgba(217,119,6,0.08)" }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-7 h-7 text-amber-600"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M9 7V5a3 3 0 0 1 6 0v2" />
          <path d="M12 13v4M10 15h4" />
        </svg>
      </div>

      <h2 className="font-display text-2xl text-stone-900 mb-2">
        Post your first job
      </h2>
      <p className="text-sm text-stone-500 max-w-md leading-relaxed mb-7">
        Describe what you need — from plumbing to electrical work — and get competitive quotes
        from verified, background-checked tradespeople near you.
      </p>

      <Link
        href="/client/post-job"
        className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-xl
          transition-all duration-150 hover:-translate-y-px"
        style={{
          background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
          boxShadow: "0 4px 14px rgba(180,83,9,0.28)",
        }}
      >
        <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M8 2v12M2 8h12" />
        </svg>
        Post a Job
      </Link>

      {/* Trust signals */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 text-xs text-stone-400">
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 1.5L2.5 4v4c0 3.1 2.4 5.4 5.5 6 3.1-.6 5.5-2.9 5.5-6V4L8 1.5z" />
            <path d="M5.5 8.5l2 2 3-3" />
          </svg>
          All workers verified
        </span>
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 4.5V8l2.5 1.5" />
          </svg>
          Quotes in minutes
        </span>
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-amber-400" fill="currentColor" aria-hidden="true">
            <path d="M8 1l1.5 3.1 3.5.5-2.5 2.5.6 3.5L8 8.8 4.9 10.6l.6-3.5L3 4.6l3.5-.5L8 1z" />
          </svg>
          Rated &amp; reviewed workers
        </span>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */

export default async function ClientDashboardPage() {
  const session = await getSession();
  const profile = await getClientProfile(session!.userId);

  const firstName = profile.name.split(" ")[0];
  const hasActivity = profile.recentJobs.length > 0;
  const pendingQuotes = profile.receivedQuotes.filter((q) => q.status === "pending");
  const hasStats = profile.stats.jobsPosted > 0;
  const profileComplete = profile.profileComplete;

  return (
    <div className="space-y-7">

      {/* ── Profile incomplete banner ────────────────────────────────── */}
      {!profileComplete && <ProfileIncompleteBanner />}

      {/* ── Welcome ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-stone-900 leading-tight">
            Welcome back, {firstName}
          </h1>
          {profile.location && (
            <p className="text-sm text-stone-500 mt-1">{profile.location}</p>
          )}
        </div>

        <Link
          href="/client/post-job"
          className="self-start sm:self-auto inline-flex items-center gap-2
            text-sm font-semibold text-white px-5 py-2.5 rounded-xl
            transition-all duration-150 hover:-translate-y-px shrink-0"
          style={{
            background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
            boxShadow: "0 2px 8px rgba(180,83,9,0.25)",
          }}
        >
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 2v12M2 8h12" />
          </svg>
          Post a Job
        </Link>
      </div>

      {/* ── No activity yet ─────────────────────────────────────────── */}
      {!hasActivity && <PostJobPrompt />}

      {/* ── Active dashboard ─────────────────────────────────────────── */}
      {hasActivity && (
        <>
          {/* Stats */}
          {hasStats && (
            <section aria-labelledby="stats-heading">
              <SectionLabel>
                <span id="stats-heading">Your Activity</span>
              </SectionLabel>
              <ClientStatsRow stats={profile.stats} />
            </section>
          )}

          {/* Received quotes */}
          <section aria-labelledby="quotes-heading">
            <div className="flex items-center justify-between mb-3">
              <SectionLabel>
                <span id="quotes-heading">Received Quotes</span>
              </SectionLabel>
              {pendingQuotes.length > 0 && (
                <span
                  className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full"
                  aria-label={`${pendingQuotes.length} quotes waiting for your decision`}
                >
                  {pendingQuotes.length} pending
                </span>
              )}
            </div>
            <QuotesInbox quotes={profile.receivedQuotes} />
          </section>

          {/* Jobs list */}
          <section aria-labelledby="jobs-heading">
            <SectionLabel>
              <span id="jobs-heading">Your Jobs</span>
            </SectionLabel>
            <JobsPanel jobs={profile.recentJobs} />
          </section>
        </>
      )}

    </div>
  );
}
