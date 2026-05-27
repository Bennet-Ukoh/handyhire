import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkerVerificationDetail, getWorkerAuditLog } from "@/lib/admin/service";
import type { VerificationRecord, VerificationStatus, NINLookupData, VerificationDocument } from "@/lib/worker/types";
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

/* ── NIN identity preview (shown to admin) ──────────────────────────── */

function NINIdentityCard({ data }: { data: NINLookupData }) {
  const fullName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(" ");
  const dob = data.dateOfBirth
    ? new Date(data.dateOfBirth).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })
    : null;
  const genderLabel = data.gender === "M" ? "Male" : data.gender === "F" ? "Female" : null;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid rgba(0,0,0,0.08)" }}
    >
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #1c1917 0%, #292524 100%)" }}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-300">
          Worker-confirmed NIMC Record
        </span>
        <span className="text-xs font-mono text-stone-400">
          {data.nin.replace(/(\d{3})(\d{4})(\d{4})/, "$1 $2 $3")}
        </span>
      </div>
      <div className="bg-stone-50 px-4 py-4 flex items-start gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.photoUrl}
          alt={`NIMC photo for ${fullName}`}
          className="w-16 h-16 rounded-xl object-cover shrink-0"
          style={{ border: "2px solid rgba(0,0,0,0.08)" }}
        />
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 flex-1 min-w-0">
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Name</dt>
            <dd className="text-sm font-semibold text-stone-800 leading-snug">{fullName}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Phone</dt>
            <dd className="text-sm font-semibold text-stone-700">{data.phoneNumber}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Location</dt>
            <dd className="text-sm font-semibold text-stone-700">{data.location}</dd>
          </div>
          {dob && (
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Date of Birth</dt>
              <dd className="text-sm font-semibold text-stone-700">{dob}</dd>
            </div>
          )}
          {genderLabel && (
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Gender</dt>
              <dd className="text-sm font-semibold text-stone-700">{genderLabel}</dd>
            </div>
          )}
        </dl>
      </div>
      {/* Confirmation note */}
      <div
        className="px-4 py-2 flex items-center gap-2"
        style={{ background: "rgba(16,185,129,0.05)", borderTop: "1px solid rgba(16,185,129,0.15)" }}
      >
        <svg viewBox="0 0 12 12" className="w-3 h-3 text-emerald-600 shrink-0" fill="none" aria-hidden="true">
          <path d="M2 6l2.5 2.5L10 3.5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-[11px] text-emerald-700 font-medium">
          Worker confirmed this record belongs to them
        </p>
      </div>
    </div>
  );
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

      {/* NIN identity data (shown only on NIN card when available) */}
      {checkType === "nin" && record.ninLookupData && (
        <NINIdentityCard data={record.ninLookupData} />
      )}

      {/* Timeline */}
      <dl className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <dt className="text-stone-400 font-medium">Submitted</dt>
          <dd className="text-stone-700 font-medium">{fmt(record.submittedAt)}</dd>
        </div>
        {checkType === "nin" && record.ninConfirmedAt && (
          <div className="flex items-center justify-between text-xs">
            <dt className="text-stone-400 font-medium">Worker confirmed</dt>
            <dd className="text-stone-700 font-medium">{fmt(record.ninConfirmedAt)}</dd>
          </div>
        )}
        {record.reviewedAt && (
          <div className="flex items-center justify-between text-xs">
            <dt className="text-stone-400 font-medium">Reviewed by admin</dt>
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

/* ── Documents section ──────────────────────────────────────────────── */

const DOC_TYPE_LABELS: Record<string, string> = {
  trade_test: "Trade Test",
  work_photo: "Work Photo",
  other:      "Supporting Doc",
};

function DocumentsSection({ documents }: { documents: VerificationDocument[] }) {
  if (documents.length === 0) return null;

  const byType = documents.reduce<Record<string, VerificationDocument[]>>((acc, d) => {
    (acc[d.type] ??= []).push(d);
    return acc;
  }, {});

  return (
    <section aria-labelledby="docs-heading" className="space-y-3">
      <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400" id="docs-heading">
        Supporting Documents
      </p>
      <div className="bg-white rounded-2xl p-5 space-y-4"
        style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        {Object.entries(byType).map(([type, docs]) => (
          <div key={type}>
            <p className="text-xs font-semibold text-stone-600 mb-2">
              {DOC_TYPE_LABELS[type] ?? type} ({docs.length})
            </p>
            <ul className="space-y-1.5">
              {docs.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <svg viewBox="0 0 16 16" className="w-4 h-4 text-stone-400 shrink-0" fill="currentColor" aria-hidden="true">
                    <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.83a2 2 0 0 0-.59-1.42l-2.82-2.82A2 2 0 0 0 9.17 0H4zm5 1.5V4a1 1 0 0 0 1 1h2.5L9 1.5z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-stone-700 truncate">{doc.label}</p>
                    <p className="text-[10px] text-stone-400">
                      {new Date(doc.uploadedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  {doc.dataUrl.startsWith("data:image/") && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={doc.dataUrl}
                      alt={doc.label}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                      style={{ border: "1px solid rgba(0,0,0,0.08)" }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
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

      {/* Supporting documents */}
      {detail.verification.documents && detail.verification.documents.length > 0 && (
        <DocumentsSection documents={detail.verification.documents} />
      )}

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
