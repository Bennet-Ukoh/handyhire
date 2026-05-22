import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getWorkerProfile } from "@/lib/worker/service";
import { deriveOverallStatus } from "@/lib/worker/types";
import type { OverallVerificationStatus } from "@/lib/worker/types";
import VerificationCard from "@/components/worker/VerificationCard";
import ProfileProgress from "@/components/worker/ProfileProgress";
import StatsRow from "@/components/worker/StatsRow";
import JobFeed from "@/components/worker/JobFeed";
import QuotesPanel from "@/components/worker/QuotesPanel";

export const metadata: Metadata = { title: "Worker Dashboard — HandyHire" };

/* ── Overall status banner config ───────────────────────────────────── */

const OVERALL_CONFIG: Record<
  OverallVerificationStatus,
  { bg: string; border: string; dot: string; text: string; sub: string }
> = {
  incomplete: {
    bg:     "rgba(120,113,108,0.05)",
    border: "rgba(120,113,108,0.16)",
    dot:    "#a8a29e",
    text:   "Complete your verification to start earning",
    sub:    "Submit your NIN and pass a background check to unlock jobs on HandyHire.",
  },
  in_progress: {
    bg:     "rgba(59,130,246,0.05)",
    border: "rgba(59,130,246,0.14)",
    dot:    "#3b82f6",
    text:   "Verification in progress",
    sub:    "We're reviewing your documents. You'll be notified as soon as you're cleared to work.",
  },
  verified: {
    bg:     "rgba(16,185,129,0.05)",
    border: "rgba(16,185,129,0.16)",
    dot:    "#10b981",
    text:   "You're fully verified",
    sub:    "Your identity and background have been confirmed. Your job feed is active.",
  },
  rejected: {
    bg:     "rgba(239,68,68,0.05)",
    border: "rgba(239,68,68,0.14)",
    dot:    "#ef4444",
    text:   "Action required — verification rejected",
    sub:    "One or more checks could not be completed. Review the details below and resubmit.",
  },
};

/* ── Locked feed banner ─────────────────────────────────────────────── */

function LockedFeedBanner({
  overallStatus,
}: {
  overallStatus: OverallVerificationStatus;
}) {
  const isRejected = overallStatus === "rejected";

  return (
    <div
      className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
      style={{
        background: isRejected ? "rgba(239,68,68,0.04)" : "rgba(0,0,0,0.025)",
        border: `1px solid ${isRejected ? "rgba(239,68,68,0.14)" : "rgba(0,0,0,0.07)"}`,
      }}
    >
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: isRejected ? "rgba(239,68,68,0.08)" : "rgba(0,0,0,0.05)" }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5"
          stroke={isRejected ? "#ef4444" : "#a8a29e"}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-stone-700">
          {isRejected
            ? "Job feed locked — resubmit to restore access"
            : "Job feed unlocks after full verification"}
        </p>
        <p className="text-xs text-stone-400 mt-1 leading-relaxed">
          {isRejected
            ? "At least one check was rejected. Fix the issue above to regain access."
            : "Complete both NIN and background check verification to browse and quote on nearby jobs."}
        </p>
      </div>

      {!isRejected && overallStatus === "incomplete" && (
        <Link
          href="/worker/verification"
          className="shrink-0 text-sm font-semibold text-white px-4 py-2.5 rounded-xl
            transition-all duration-150 hover:-translate-y-px"
          style={{
            background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
            boxShadow: "0 2px 8px rgba(180,83,9,0.25)",
          }}
        >
          Start verification
        </Link>
      )}
    </div>
  );
}

/* ── Section heading ────────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-3">
      {children}
    </p>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */

export default async function WorkerDashboardPage() {
  const session = await getSession();
  const profile = await getWorkerProfile(session!.userId);

  const overallStatus = deriveOverallStatus(profile.verification);
  const isVerified = overallStatus === "verified";
  const hasStats = profile.stats.jobsCompleted > 0;
  const banner = OVERALL_CONFIG[overallStatus];

  return (
    <div className="space-y-7">

      {/* ── Welcome ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-stone-900 leading-tight">
            Welcome back, {profile.name.split(" ")[0]}
          </h1>
          {profile.trade && (
            <p className="text-sm text-stone-500 mt-1">
              {profile.trade}
              {profile.location && (
                <span className="text-stone-400"> · {profile.location}</span>
              )}
            </p>
          )}
        </div>

        {/* Availability pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-full"
            style={{
              background: isVerified
                ? "rgba(16,185,129,0.08)"
                : "rgba(120,113,108,0.07)",
              border: isVerified
                ? "1px solid rgba(16,185,129,0.2)"
                : "1px solid rgba(0,0,0,0.08)",
              color: isVerified ? "#065f46" : "#78716c",
            }}
          >
            <span
              className={`w-2 h-2 rounded-full ${isVerified ? "online-pulse" : ""}`}
              style={{
                background: isVerified ? "#10b981" : "#a8a29e",
              }}
            />
            {isVerified ? "Available for work" : "Pending verification"}
          </span>
        </div>
      </div>

      {/* ── Account Verification ────────────────────────────────────── */}
      <section aria-labelledby="verification-heading">
        <SectionLabel>
          <span id="verification-heading">Account Verification</span>
        </SectionLabel>

        {/* Overall status banner */}
        <div
          className="flex items-start gap-3 rounded-xl px-4 py-3.5 mb-4"
          style={{ background: banner.bg, border: `1px solid ${banner.border}` }}
          role="status"
          aria-live="polite"
        >
          <span
            className="w-2 h-2 rounded-full shrink-0 mt-1.5"
            style={{ background: banner.dot }}
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-stone-800">{banner.text}</p>
            <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{banner.sub}</p>
          </div>
        </div>

        {/* NIN + Background check cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <VerificationCard type="nin" record={profile.verification.nin} ctaHref="/worker/verification" />
          <VerificationCard type="backgroundCheck" record={profile.verification.backgroundCheck} ctaHref="/worker/verification" />
        </div>
      </section>

      {/* ── Profile completeness ─────────────────────────────────────── */}
      {profile.completeness.percentage < 100 && (
        <section aria-labelledby="profile-heading">
          <SectionLabel>
            <span id="profile-heading">Profile Completeness</span>
          </SectionLabel>
          <ProfileProgress completeness={profile.completeness} />
        </section>
      )}

      {/* ── Performance stats ────────────────────────────────────────── */}
      {hasStats && (
        <section aria-labelledby="stats-heading">
          <SectionLabel>
            <span id="stats-heading">Your Performance</span>
          </SectionLabel>
          <StatsRow stats={profile.stats} />
        </section>
      )}

      {/* ── Jobs & quotes ────────────────────────────────────────────── */}
      <section aria-labelledby="jobs-heading">
        <SectionLabel>
          <span id="jobs-heading">Jobs &amp; Quotes</span>
        </SectionLabel>

        {isVerified ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <JobFeed jobs={profile.nearbyJobs} />
            </div>
            <div>
              <QuotesPanel quotes={profile.activeQuotes} />
            </div>
          </div>
        ) : (
          <LockedFeedBanner overallStatus={overallStatus} />
        )}
      </section>

    </div>
  );
}
