import type { Metadata } from "next";
import Link from "next/link";
import { getVerificationQueue } from "@/lib/admin/service";
import type { QueueFilter } from "@/lib/admin/types";
import type { OverallVerificationStatus, VerificationStatus } from "@/lib/worker/types";

export const metadata: Metadata = { title: "Verifications — Admin — HandyHire" };

/* ── Filter tabs ────────────────────────────────────────────────────── */

const FILTERS: { value: QueueFilter; label: string }[] = [
  { value: "all",           label: "All" },
  { value: "pending",       label: "Pending" },
  { value: "in_review",     label: "In Review" },
  { value: "manual_review", label: "Manual Review" },
  { value: "verified",      label: "Verified" },
  { value: "rejected",      label: "Rejected" },
];

/* ── Status pill configs ────────────────────────────────────────────── */

const OVERALL_PILL: Record<OverallVerificationStatus, { bg: string; text: string; dot: string; label: string }> = {
  incomplete:  { bg: "rgba(120,113,108,0.08)", text: "#78716c", dot: "#a8a29e", label: "Not started" },
  in_progress: { bg: "rgba(59,130,246,0.08)",  text: "#1d4ed8", dot: "#3b82f6", label: "In progress" },
  verified:    { bg: "rgba(16,185,129,0.08)",  text: "#065f46", dot: "#10b981", label: "Verified" },
  rejected:    { bg: "rgba(239,68,68,0.08)",   text: "#b91c1c", dot: "#ef4444", label: "Rejected" },
};

const CHECK_STATUS_COLOR: Record<VerificationStatus, string> = {
  unverified:    "#a8a29e",
  pending:       "#f59e0b",
  in_review:     "#3b82f6",
  manual_review: "#8b5cf6",
  verified:      "#10b981",
  rejected:      "#ef4444",
};

const CHECK_STATUS_LABEL: Record<VerificationStatus, string> = {
  unverified:    "—",
  pending:       "Pending",
  in_review:     "In review",
  manual_review: "Manual",
  verified:      "Verified",
  rejected:      "Rejected",
};

/* ── Page ───────────────────────────────────────────────────────────── */

interface PageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function AdminVerificationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawFilter = params.filter ?? "all";
  const activeFilter: QueueFilter = FILTERS.some((f) => f.value === rawFilter)
    ? (rawFilter as QueueFilter)
    : "all";

  const items = getVerificationQueue(activeFilter);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-stone-900 leading-tight">
          Verification Queue
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Review worker identity and background check submissions.
        </p>
      </div>

      {/* Filter tabs */}
      <nav className="flex items-center gap-1 flex-wrap" aria-label="Filter verifications">
        {FILTERS.map((f) => {
          const isActive = f.value === activeFilter;
          return (
            <Link
              key={f.value}
              href={`/admin/verifications?filter=${f.value}`}
              className="text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-150"
              style={{
                background: isActive ? "#1c1917" : "rgba(0,0,0,0.04)",
                color: isActive ? "#fff" : "#78716c",
              }}
            >
              {f.label}
            </Link>
          );
        })}
      </nav>

      {/* Queue list */}
      {items.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div
            className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.04)" }}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-stone-400" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 2.5L3.5 5.5v4.5c0 3.5 2.8 6.3 6.5 7 3.7-.7 6.5-3.5 6.5-7V5.5L10 2.5z" />
              <path d="M7 10.5l2 2 4-4" />
            </svg>
          </div>
          <p className="text-sm font-medium text-stone-500">
            No verifications in this view
          </p>
          <p className="text-xs text-stone-400 mt-1">
            {activeFilter === "all"
              ? "Workers will appear here once they submit a check."
              : `No workers currently have ${activeFilter.replace("_", " ")} status.`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const pill = OVERALL_PILL[item.overallStatus];
            const ninColor = CHECK_STATUS_COLOR[item.verification.nin.status];
            const bgColor  = CHECK_STATUS_COLOR[item.verification.backgroundCheck.status];
            const ninLabel = CHECK_STATUS_LABEL[item.verification.nin.status];
            const bgLabel  = CHECK_STATUS_LABEL[item.verification.backgroundCheck.status];
            const joined = new Date(item.joinedAt).toLocaleDateString("en-NG", {
              day: "numeric", month: "short", year: "numeric",
            });
            const lastActivity = new Date(item.lastActivityAt).toLocaleDateString("en-NG", {
              day: "numeric", month: "short", year: "numeric",
            });

            return (
              <Link
                key={item.userId}
                href={`/admin/verifications/${item.userId}`}
                className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 transition-all duration-150 hover:shadow-md group"
                style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
              >
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #292524 0%, #44403c 100%)" }}
                >
                  {item.workerName.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-stone-800 truncate">{item.workerName}</p>
                    <span
                      className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: pill.bg, color: pill.text }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: pill.dot }} />
                      {pill.label}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5 truncate">
                    {item.trade ?? "Worker"}{item.location ? ` · ${item.location}` : ""}
                  </p>
                </div>

                {/* Check status indicators */}
                <div className="hidden sm:flex items-center gap-4 shrink-0">
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-300 mb-0.5">NIN</p>
                    <span className="text-xs font-semibold" style={{ color: ninColor }}>{ninLabel}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-300 mb-0.5">BG Check</p>
                    <span className="text-xs font-semibold" style={{ color: bgColor }}>{bgLabel}</span>
                  </div>
                  <div className="text-center hidden md:block">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-300 mb-0.5">Joined</p>
                    <span className="text-xs text-stone-400">{joined}</span>
                  </div>
                  <div className="text-center hidden md:block">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-300 mb-0.5">Last activity</p>
                    <span className="text-xs text-stone-400">{lastActivity}</span>
                  </div>
                </div>

                <svg viewBox="0 0 16 16" className="w-4 h-4 text-stone-300 group-hover:text-stone-500 shrink-0 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 3l5 5-5 5" />
                </svg>
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}
