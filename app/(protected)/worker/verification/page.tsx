import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getVerification } from "@/lib/worker/verification-store";
import { deriveOverallStatus } from "@/lib/worker/types";
import type { VerificationRecord, VerificationStatus, OverallVerificationStatus } from "@/lib/worker/types";
import NINSubmitForm from "@/components/worker/NINSubmitForm";
import BackgroundCheckForm from "@/components/worker/BackgroundCheckForm";
import VerificationDocuments from "@/components/worker/VerificationDocuments";

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
    sub:    "Our compliance team is reviewing your documents. You'll be notified once you're cleared.",
  },
  verified: {
    bg:     "rgba(16,185,129,0.05)",
    border: "rgba(16,185,129,0.16)",
    dot:    "#10b981",
    text:   "You're fully verified",
    sub:    "Your identity and background have been confirmed by admin. Your job feed is active.",
  },
  rejected: {
    bg:     "rgba(239,68,68,0.05)",
    border: "rgba(239,68,68,0.14)",
    dot:    "#ef4444",
    text:   "Action required",
    sub:    "One or more checks were rejected by our team. Review the details below and resubmit.",
  },
};

/* ── Status display helpers ─────────────────────────────────────────── */

const ACTIVE_STATUSES: VerificationStatus[] = ["pending", "in_review", "manual_review", "verified", "rejected"];

function isNINSubmitted(status: VerificationStatus): boolean {
  return ACTIVE_STATUSES.includes(status);
}

function WaitingState({ record, label }: { record: VerificationRecord; label: string }) {
  const isInReview   = record.status === "in_review";
  const isManual     = record.status === "manual_review";
  const dot          = isInReview || isManual ? "#3b82f6" : "#f59e0b";
  const bg           = isInReview || isManual ? "rgba(59,130,246,0.06)" : "rgba(251,191,36,0.08)";
  const border       = isInReview || isManual ? "rgba(59,130,246,0.2)" : "rgba(251,191,36,0.3)";
  const textColor    = isInReview || isManual ? "#1d4ed8" : "#92400e";
  const subColor     = isInReview || isManual ? "#3b82f6" : "#b45309";

  const statusLabel  = isInReview ? "is being reviewed by admin"
    : isManual ? "has been flagged for manual review"
    : "submitted — awaiting admin review";

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
          {label} {statusLabel}
        </p>
        {formatted && (
          <p className="text-xs mt-0.5" style={{ color: subColor }}>
            Submitted {formatted}
          </p>
        )}
        {(isInReview || isManual) && (
          <p className="text-xs mt-0.5" style={{ color: subColor }}>
            Our team is actively reviewing — you'll receive an update within 1–3 business days.
          </p>
        )}
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
      <p className="text-sm font-semibold text-emerald-800">{label} approved by admin</p>
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
      <p className="text-xs text-red-400 mt-1">
        Please resubmit below, or contact{" "}
        <span className="font-medium">support@handyhire.ng</span> for help.
      </p>
    </div>
  );
}

/* ── Step card ──────────────────────────────────────────────────────── */

function StepCard({
  number,
  title,
  sub,
  complete,
  children,
}: {
  number: number;
  title: string;
  sub: string;
  complete?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-white rounded-2xl p-6 space-y-5"
      style={{
        border: complete
          ? "1px solid rgba(16,185,129,0.25)"
          : "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex items-start gap-4">
        <span
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold text-white"
          style={{
            background: complete
              ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
              : "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
          }}
        >
          {complete ? (
            <svg viewBox="0 0 12 12" className="w-4 h-4" fill="none" aria-hidden="true">
              <path d="M2 6l2.5 2.5L10 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : number}
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
  const ninSubmitted = isNINSubmitted(ninStatus);

  // Documents step is shown once NIN is at least pending
  const showDocuments = ninStatus !== "unverified";

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
          Verify your identity to unlock jobs and start earning. All checks are reviewed by our admin team.
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
        sub="Enter your 11-digit National Identity Number. We'll look up your NIMC record and ask you to confirm it's yours before submitting for admin review."
        complete={ninStatus === "verified"}
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

      {/* Step 2 — Supporting documents (optional, shown after NIN submitted) */}
      {showDocuments && (
        <StepCard
          number={2}
          title="Supporting Documents"
          sub="Optional but recommended. Upload your trade test certificate, work photos, or any other credentials that help verify your skills."
        >
          <VerificationDocuments existingDocuments={verification.documents ?? []} />
        </StepCard>
      )}

      {/* Step 3 — Background check */}
      <StepCard
        number={showDocuments ? 3 : 2}
        title="Background Check"
        sub="A standard check covering identity confirmation, criminal record, and work history. Admin-reviewed after submission."
        complete={bgStatus === "verified"}
      >
        {bgStatus === "unverified" && (
          <BackgroundCheckForm ninReady={ninSubmitted} />
        )}
        {(bgStatus === "pending" || bgStatus === "in_review" || bgStatus === "manual_review") && (
          <WaitingState record={verification.backgroundCheck} label="Background check" />
        )}
        {bgStatus === "verified" && <VerifiedState label="Background check" />}
        {bgStatus === "rejected" && (
          <div className="space-y-3">
            <div
              className="rounded-xl px-4 py-3.5 space-y-1"
              style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.18)" }}
            >
              <p className="text-sm font-semibold text-red-700">Background check rejected</p>
              {verification.backgroundCheck.rejectionReason && (
                <p className="text-xs text-red-500">{verification.backgroundCheck.rejectionReason}</p>
              )}
            </div>
            <p className="text-xs text-stone-500">
              Please contact{" "}
              <span className="font-medium text-stone-700">support@handyhire.ng</span>{" "}
              to resolve this.
            </p>
          </div>
        )}
      </StepCard>

      {/* Admin-only note */}
      <div
        className="flex items-start gap-3 rounded-xl px-4 py-3"
        style={{ background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.14)" }}
      >
        <svg viewBox="0 0 16 16" className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" fill="currentColor" aria-hidden="true">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.5h1.5v5h-1.5v-5zm0 6h1.5v1.5h-1.5V10.5z" />
        </svg>
        <p className="text-xs text-indigo-700">
          <strong>Verification is admin-reviewed.</strong> Our team personally reviews every NIN submission and background check. Only admin-approved workers can access the job feed.
        </p>
      </div>

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
