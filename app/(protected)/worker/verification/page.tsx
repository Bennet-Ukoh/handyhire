import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getVerification } from "@/lib/worker/verification-store";
import { deriveOverallStatus } from "@/lib/worker/types";
import type { VerificationRecord, VerificationStatus, OverallVerificationStatus } from "@/lib/worker/types";
import NINSubmitForm from "@/components/worker/NINSubmitForm";
import BackgroundCheckForm from "@/components/worker/BackgroundCheckForm";
import SimulateReviewButton from "@/components/worker/SimulateReviewButton";

export const metadata: Metadata = { title: "Verification — HandyHire" };

/* ── Overall status banner config ───────────────────────────────────── */

const OVERALL_CONFIG: Record<
  OverallVerificationStatus,
  { bg: string; border: string; dot: string; text: string; sub: string }
> = {
  incomplete: {
    bg:     "rgba(120,113,108,0.05)",
    border: "rgba(120,113,108,0.16)",
    dot:    "#a8a29e",
    text:   "Let's get you verified",
    sub:    "Complete both steps below to unlock your job feed and start earning on HandyHire.",
  },
  in_progress: {
    bg:     "rgba(59,130,246,0.05)",
    border: "rgba(59,130,246,0.14)",
    dot:    "#3b82f6",
    text:   "Verification in progress",
    sub:    "Our team is reviewing your documents. You'll be notified when you're cleared.",
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
    text:   "Action required",
    sub:    "One or more checks were rejected. Review the details below and resubmit.",
  },
};

/* ── Step status display ─────────────────────────────────────────────── */

const ACTIVE_STATUSES: VerificationStatus[] = ["pending", "in_review", "manual_review", "verified", "rejected"];

function isNINReady(status: VerificationStatus): boolean {
  return ACTIVE_STATUSES.includes(status);
}

function WaitingState({ record, label }: { record: VerificationRecord; label: string }) {
  const isInReview = record.status === "in_review";
  const dot = isInReview ? "#3b82f6" : "#f59e0b";
  const bg  = isInReview ? "rgba(59,130,246,0.06)" : "rgba(251,191,36,0.08)";
  const border = isInReview ? "rgba(59,130,246,0.2)" : "rgba(251,191,36,0.3)";
  const textColor = isInReview ? "#1d4ed8" : "#92400e";
  const subColor  = isInReview ? "#3b82f6" : "#b45309";

  const formatted = record.submittedAt
    ? new Date(record.submittedAt).toLocaleDateString("en-NG", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <div
      className="flex items-start gap-3 rounded-xl px-4 py-3.5"
      style={{ background: bg, border: `1px solid ${border}` }}
      role="status"
      aria-live="polite"
    >
      <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: dot }} />
      <div>
        <p className="text-sm font-semibold" style={{ color: textColor }}>
          {isInReview ? `${label} is being reviewed` : `${label} submitted`}
        </p>
        <p className="text-xs mt-0.5" style={{ color: subColor }}>
          {isInReview
            ? "Our compliance team is actively reviewing your documents."
            : formatted
              ? `Submitted ${formatted} — review will begin shortly.`
              : "Submitted — review will begin shortly."}
        </p>
      </div>
    </div>
  );
}

function VerifiedState({ label }: { label: string }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3.5"
      style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}
    >
      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "rgba(16,185,129,0.15)" }}>
        <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" aria-hidden="true">
          <path d="M2 6l2.5 2.5L10 3.5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <p className="text-sm font-semibold text-emerald-800">{label} verified</p>
    </div>
  );
}

function RejectedState({ record, label }: { record: VerificationRecord; label: string }) {
  return (
    <div
      className="rounded-xl px-4 py-3.5 space-y-1"
      style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.18)" }}
    >
      <p className="text-sm font-semibold text-red-700">{label} rejected</p>
      {record.rejectionReason && (
        <p className="text-xs text-red-500">{record.rejectionReason}</p>
      )}
    </div>
  );
}

/* ── Step card wrapper ───────────────────────────────────────────────── */

function StepCard({
  number,
  title,
  sub,
  children,
}: {
  number: number;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-white rounded-2xl p-6 space-y-5"
      style={{
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex items-start gap-4">
        <span
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold text-white"
          style={{ background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)" }}
        >
          {number}
        </span>
        <div>
          <p className="text-sm font-semibold text-stone-800">{title}</p>
          <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{sub}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */

export default async function VerificationPage() {
  const session = await getSession();
  const verification = getVerification(session!.userId);
  const overallStatus = deriveOverallStatus(verification);
  const banner = OVERALL_CONFIG[overallStatus];

  const ninStatus = verification.nin.status;
  const bgStatus  = verification.backgroundCheck.status;
  const ninReady  = isNINReady(ninStatus);

  const isDevMode = process.env.NODE_ENV !== "production";

  return (
    <div className="max-w-2xl space-y-6">

      {/* Back link */}
      <Link
        href="/worker/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-stone-600 transition-colors"
      >
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 3L5 8l5 5" />
        </svg>
        Back to dashboard
      </Link>

      {/* Page header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-stone-900 leading-tight">
          Account Verification
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Verify your identity to unlock jobs and start earning.
        </p>
      </div>

      {/* Overall status banner */}
      <div
        className="flex items-start gap-3 rounded-xl px-4 py-3.5"
        style={{ background: banner.bg, border: `1px solid ${banner.border}` }}
        role="status"
        aria-live="polite"
      >
        <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: banner.dot }} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-stone-800">{banner.text}</p>
          <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{banner.sub}</p>
        </div>
      </div>

      {/* Step 1 — NIN */}
      <StepCard
        number={1}
        title="Identity Verification (NIN)"
        sub="Your 11-digit National Identity Number links your account to NIMC records."
      >
        {ninStatus === "unverified" && <NINSubmitForm />}
        {(ninStatus === "pending" || ninStatus === "in_review" || ninStatus === "manual_review") && (
          <WaitingState record={verification.nin} label="NIN" />
        )}
        {ninStatus === "verified" && <VerifiedState label="NIN" />}
        {ninStatus === "rejected" && (
          <div className="space-y-4">
            <RejectedState record={verification.nin} label="NIN" />
            <NINSubmitForm />
          </div>
        )}
      </StepCard>

      {/* Step 2 — Background check */}
      <StepCard
        number={2}
        title="Background Check"
        sub="A standard check covering identity, criminal record, and work history."
      >
        {bgStatus === "unverified" && (
          <BackgroundCheckForm ninReady={ninReady} />
        )}
        {(bgStatus === "pending" || bgStatus === "in_review" || bgStatus === "manual_review") && (
          <WaitingState record={verification.backgroundCheck} label="Background check" />
        )}
        {bgStatus === "verified" && <VerifiedState label="Background check" />}
        {bgStatus === "rejected" && (
          <div
            className="rounded-xl px-4 py-3.5 space-y-1"
            style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.18)" }}
          >
            <p className="text-sm font-semibold text-red-700">Background check rejected</p>
            {verification.backgroundCheck.rejectionReason && (
              <p className="text-xs text-red-500">{verification.backgroundCheck.rejectionReason}</p>
            )}
            <p className="text-xs text-red-400 mt-1">
              Please contact{" "}
              <span className="font-medium">support@handyhire.ng</span>{" "}
              to resolve this.
            </p>
          </div>
        )}
      </StepCard>

      {/* Dev panel — simulate review progression */}
      {isDevMode && (
        <div
          className="rounded-2xl p-5 space-y-3"
          style={{ background: "rgba(99,102,241,0.04)", border: "1px dashed rgba(99,102,241,0.25)" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
              Dev tool
            </span>
            <span className="h-px flex-1" style={{ background: "rgba(99,102,241,0.15)" }} />
          </div>
          <p className="text-xs text-indigo-500">
            Simulate the admin review pipeline: <strong>pending → in_review → verified</strong>.
            Click once to move to &ldquo;in review&rdquo;, again to mark as verified.
          </p>
          <SimulateReviewButton />
        </div>
      )}

      {/* Go to dashboard CTA when fully verified */}
      {overallStatus === "verified" && (
        <Link
          href="/worker/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl
            transition-all duration-150 hover:-translate-y-px"
          style={{
            background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
            boxShadow: "0 2px 8px rgba(5,150,105,0.3)",
          }}
        >
          Go to dashboard
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>
      )}

    </div>
  );
}
