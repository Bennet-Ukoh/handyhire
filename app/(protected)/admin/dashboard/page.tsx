import type { Metadata } from "next";
import Link from "next/link";
import { getAdminStats, getVerificationQueue, getWorkerAuditLog } from "@/lib/admin/service";
import type { AdminStats } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Admin Overview — HandyHire" };

/* ── Stat card ──────────────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  accent,
  sub,
}: {
  label: string;
  value: number;
  accent: string;
  sub?: string;
}) {
  return (
    <div
      className="bg-white rounded-2xl p-5"
      style={{
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-2">{label}</p>
      <p className="font-display text-3xl font-bold" style={{ color: accent }}>
        {value.toLocaleString()}
      </p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </div>
  );
}

/* ── Section label ──────────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-3">
      {children}
    </p>
  );
}

/* ── Overall status pill ────────────────────────────────────────────── */

const STATUS_PILL: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  incomplete:    { bg: "rgba(120,113,108,0.08)", text: "#78716c", dot: "#a8a29e", label: "Not started" },
  in_progress:   { bg: "rgba(59,130,246,0.08)",  text: "#1d4ed8", dot: "#3b82f6", label: "In progress" },
  verified:      { bg: "rgba(16,185,129,0.08)",  text: "#065f46", dot: "#10b981", label: "Verified" },
  rejected:      { bg: "rgba(239,68,68,0.08)",   text: "#b91c1c", dot: "#ef4444", label: "Rejected" },
};

/* ── Page ───────────────────────────────────────────────────────────── */

export default async function AdminDashboardPage() {
  const stats   = getAdminStats();
  const queue   = getVerificationQueue("pending").slice(0, 3);
  const inReview = getVerificationQueue("in_review").slice(0, 3);
  const recentLog = getWorkerAuditLog().slice(0, 5);
  const actionQueue = [...queue, ...inReview].slice(0, 5);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-stone-900 leading-tight">
          Platform Overview
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          HandyHire admin — verification queue, workers, and platform health.
        </p>
      </div>

      {/* Stats row */}
      <section aria-label="Platform statistics">
        <SectionLabel>At a glance</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="Workers"       value={stats.totalWorkers}        accent="#1c1917" />
          <StatCard label="Clients"       value={stats.totalClients}        accent="#1c1917" />
          <StatCard label="Open jobs"     value={stats.openJobs}            accent="#1c1917" />
          <StatCard label="Pending review" value={stats.pendingVerifications} accent="#d97706" sub="Action needed" />
          <StatCard label="Verified"      value={stats.verifiedWorkers}      accent="#059669" />
          <StatCard label="Rejected"      value={stats.rejectedWorkers}      accent="#dc2626" />
        </div>
      </section>

      {/* Verification queue preview */}
      <section aria-labelledby="queue-heading">
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>
            <span id="queue-heading">Verification queue</span>
          </SectionLabel>
          <Link
            href="/admin/verifications"
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors"
          >
            View all →
          </Link>
        </div>

        {actionQueue.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)" }}
          >
            <p className="text-sm font-medium text-stone-400">No pending verifications</p>
            <p className="text-xs text-stone-300 mt-1">Workers awaiting review will appear here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {actionQueue.map((item) => {
              const pill = STATUS_PILL[item.overallStatus] ?? STATUS_PILL.incomplete;
              return (
                <Link
                  key={item.userId}
                  href={`/admin/verifications/${item.userId}`}
                  className="flex items-center gap-4 bg-white rounded-xl px-4 py-3.5 transition-all duration-150 hover:shadow-md group"
                  style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #292524 0%, #44403c 100%)" }}
                  >
                    {item.workerName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-800 truncate">{item.workerName}</p>
                    <p className="text-xs text-stone-400 truncate">
                      {item.trade ?? "Worker"}{item.location ? ` · ${item.location}` : ""}
                    </p>
                  </div>
                  <span
                    className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: pill.bg, color: pill.text }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: pill.dot }} />
                    {pill.label}
                  </span>
                  <svg viewBox="0 0 16 16" className="w-4 h-4 text-stone-300 group-hover:text-stone-500 shrink-0 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent admin activity */}
      <section aria-labelledby="activity-heading">
        <SectionLabel>
          <span id="activity-heading">Recent admin activity</span>
        </SectionLabel>

        {recentLog.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)" }}
          >
            <p className="text-sm font-medium text-stone-400">No admin actions yet</p>
            <p className="text-xs text-stone-300 mt-1">Review decisions will appear here as a log.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentLog.map((entry) => {
              const isApprove = entry.action.startsWith("approve");
              const isReject  = entry.action.startsWith("reject");
              const dotColor  = isApprove ? "#10b981" : isReject ? "#ef4444" : "#8b5cf6";
              const actionLabel: Record<string, string> = {
                approve_nin:           "Approved NIN",
                reject_nin:            "Rejected NIN",
                manual_review_nin:     "Flagged NIN — manual review",
                approve_bgcheck:       "Approved background check",
                reject_bgcheck:        "Rejected background check",
                manual_review_bgcheck: "Flagged background check — manual review",
              };
              const performed = new Date(entry.performedAt).toLocaleDateString("en-NG", {
                day: "numeric", month: "short", year: "numeric",
              });
              return (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 bg-white rounded-xl px-4 py-3.5"
                  style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
                >
                  <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: dotColor }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-stone-700">
                      <span className="font-semibold">{actionLabel[entry.action] ?? entry.action}</span>
                      {" for "}
                      <Link
                        href={`/admin/verifications/${entry.workerId}`}
                        className="text-amber-700 hover:underline font-medium"
                      >
                        {entry.workerName}
                      </Link>
                    </p>
                    {entry.reason && (
                      <p className="text-xs text-stone-400 mt-0.5 truncate">&ldquo;{entry.reason}&rdquo;</p>
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
