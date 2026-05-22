import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkerVerificationDetail, getWorkerAuditLog } from "@/lib/admin/service";
import type { VerificationRecord, VerificationStatus } from "@/lib/worker/types";
import AdminReviewActions from "@/components/admin/AdminReviewActions";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId } = await params;
  const detail = getWorkerVerificationDetail(userId);
  return { title: `${detail?.workerName ?? "Worker"} — Verification — HandyHire` };
}

/* ── Status config ──────────────────────────────────────────────────── */

const STATUS_CFG: Record<VerificationStatus, { label: string; dot: string; bg: string; text: string }> = {
  unverified:    { label: "Not submitted",   dot: "#a8a29e", bg: "rgba(120,113,108,0.07)", text: "#78716c" },
  pending:       { label: "Pending review",  dot: "#f59e0b", bg: "rgba(251,191,36,0.1)",   text: "#92400e" },
  in_review:     { label: "In review",       dot: "#3b82f6", bg: "rgba(59,130,246,0.08)",  text: "#1d4ed8" },
  manual_review: { label: "Manual review",   dot: "#8b5cf6", bg: "rgba(139,92,246,0.08)", text: "#5b21b6" },
  verified:      { label: "Verified",        dot: "#10b981", bg: "rgba(16,185,129,0.08)",  text: "#065f46" },
  rejected:      { label: "Rejected",        dot: "#ef4444", bg: "rgba(239,68,68,0.08)",   text: "#b91c1c" },
};

/* ── Helpers ────────────────────────────────────────────────────────── */

function fmt(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/* ── Check detail card ──────────────────────────────────────────────── */

function CheckCard({
  workerId,
  checkType,
  label,
  record,
}: {
  workerId: string;
  checkType: "nin" | "backgroundCheck";
  label: string;
  record: VerificationRecord;
}) {
  const cfg = STATUS_CFG[record.status];
  const isActionable = !["unverified", "verified"].includes(record.status);

  return (
    <div
      className="bg-white rounded-2xl p-6 space-y-5"
      style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-stone-800">{label}</p>
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shrink-0"
          style={{ background: cfg.bg, color: cfg.text }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
          {cfg.label}
        </span>
      </div>

      {/* Timeline */}
      <dl className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <dt className="text-stone-400 font-medium">Submitted</dt>
          <dd className="text-stone-700 font-medium">{fmt(record.submittedAt)}</dd>
        </div>
        {record.reviewedAt && (
          <div className="flex items-center justify-between text-xs">
            <dt className="text-stone-400 font-medium">Reviewed</dt>
            <dd className="text-stone-700 font-medium">{fmt(record.reviewedAt)}</dd>
          </div>
        )}
        {record.status === "rejected" && record.rejectionReason && (
          <div className="pt-1">
            <dt className="text-xs text-stone-400 font-medium mb-1">Rejection reason</dt>
            <dd
              className="text-xs text-red-700 rounded-xl px-3 py-2.5 leading-relaxed"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}
            >
              {record.rejectionReason}
            </dd>
          </div>
        )}
      </dl>

      {/* Separator */}
      {isActionable && (
        <div className="h-px" style={{ background: "rgba(0,0,0,0.06)" }} />
      )}

      {/* Admin actions */}
      <AdminReviewActions
        workerId={workerId}
        checkType={checkType}
        currentStatus={record.status}
        label={label}
      />
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */

export default async function WorkerVerificationDetailPage({ params }: PageProps) {
  const { userId } = await params;
  const detail  = getWorkerVerificationDetail(userId);
  if (!detail) notFound();

  const auditLog = getWorkerAuditLog(userId);
  const joined = new Date(detail.joinedAt).toLocaleDateString("en-NG", {
    day: "numeric", month: "long", year: "numeric",
  });

  const ACTION_LABELS: Record<string, string> = {
    approve_nin:           "Approved NIN",
    reject_nin:            "Rejected NIN",
    manual_review_nin:     "Flagged NIN for manual review",
    approve_bgcheck:       "Approved background check",
    reject_bgcheck:        "Rejected background check",
    manual_review_bgcheck: "Flagged background check for manual review",
  };

  return (
    <div className="max-w-3xl space-y-6">

      {/* Back */}
      <Link
        href="/admin/verifications"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-stone-600 transition-colors"
      >
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 3L5 8l5 5" />
        </svg>
        Back to queue
      </Link>

      {/* Worker header */}
      <div
        className="bg-white rounded-2xl p-6"
        style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-xl font-bold text-white"
            style={{ background: "linear-gradient(135deg, #292524 0%, #44403c 100%)" }}
          >
            {detail.workerName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl text-stone-900">{detail.workerName}</h1>
            <p className="text-sm text-stone-500 mt-0.5">{detail.workerEmail}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {detail.trade && (
                <span className="text-xs text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                  {detail.trade}
                </span>
              )}
              {detail.location && (
                <span className="text-xs text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                  {detail.location}
                </span>
              )}
              <span className="text-xs text-stone-400">
                Joined {joined}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Check cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CheckCard
          workerId={detail.userId}
          checkType="nin"
          label="NIN Verification"
          record={detail.verification.nin}
        />
        <CheckCard
          workerId={detail.userId}
          checkType="backgroundCheck"
          label="Background Check"
          record={detail.verification.backgroundCheck}
        />
      </div>

      {/* Audit log */}
      <section aria-labelledby="audit-heading">
        <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-3">
          <span id="audit-heading">Audit history</span>
        </p>

        {auditLog.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)" }}
          >
            <p className="text-sm text-stone-400">No admin actions recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {auditLog.map((entry) => {
              const isApprove = entry.action.startsWith("approve");
              const isReject  = entry.action.startsWith("reject");
              const dotColor  = isApprove ? "#10b981" : isReject ? "#ef4444" : "#8b5cf6";
              const performed = new Date(entry.performedAt).toLocaleDateString("en-NG", {
                day: "numeric", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              });
              return (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 bg-white rounded-xl px-4 py-3.5"
                  style={{ border: "1px solid rgba(0,0,0,0.07)" }}
                >
                  <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: dotColor }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-700">
                      {ACTION_LABELS[entry.action] ?? entry.action}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      by {entry.adminName}
                    </p>
                    {entry.reason && (
                      <p className="text-xs text-stone-500 mt-1 italic">&ldquo;{entry.reason}&rdquo;</p>
                    )}
                  </div>
                  <span className="text-xs text-stone-400 shrink-0">{performed}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
