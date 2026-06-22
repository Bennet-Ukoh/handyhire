import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { findJobsByClientId } from "@/lib/client/mock-store";
import type { JobStatus } from "@/lib/client/types";

export const metadata: Metadata = { title: "My Jobs — HandyHire" };

function formatNgn(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}k`;
  return `₦${amount.toLocaleString()}`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor(diff / 3_600_000);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return `${Math.max(Math.floor(diff / 60_000), 1)}m ago`;
}

const STATUS_CONFIG: Record<JobStatus, { label: string; bg: string; text: string; dot: string }> = {
  draft:       { label: "Draft",       bg: "rgba(0,0,0,0.04)",         text: "#78716c", dot: "#a8a29e" },
  open:        { label: "Open",        bg: "rgba(217,119,6,0.08)",      text: "#92400e", dot: "#d97706" },
  in_progress: { label: "In Progress", bg: "rgba(59,130,246,0.08)",     text: "#1d4ed8", dot: "#3b82f6" },
  completed:   { label: "Completed",   bg: "rgba(16,185,129,0.08)",     text: "#065f46", dot: "#10b981" },
  cancelled:   { label: "Cancelled",   bg: "rgba(239,68,68,0.06)",      text: "#b91c1c", dot: "#ef4444" },
};

type TabFilter = "all" | "open" | "in_progress" | "completed";
const TABS: { key: TabFilter; label: string }[] = [
  { key: "all",         label: "All" },
  { key: "open",        label: "Open" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed",   label: "Completed" },
];

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function ClientJobsPage({ searchParams }: Props) {
  const session = await getSession();
  const { tab: rawTab } = await searchParams;
  const tab = (["all", "open", "in_progress", "completed"].includes(rawTab ?? "") ? rawTab : "all") as TabFilter;

  const allJobs = findJobsByClientId(session!.userId);
  const jobs = tab === "all" ? allJobs : allJobs.filter((j) => j.status === tab);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-stone-900 leading-tight">My Jobs</h1>
          <p className="text-sm text-stone-500 mt-1">All jobs you&apos;ve posted on HandyHire.</p>
        </div>
        <Link
          href="/client/post-job"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-px whitespace-nowrap"
          style={{ background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)", boxShadow: "0 2px 8px rgba(180,83,9,0.24)" }}
        >
          + Post a new job
        </Link>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto -mx-1 px-1">
      <div
        className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}
        role="tablist"
      >
        {TABS.map(({ key, label }) => {
          const count = key === "all" ? allJobs.length : allJobs.filter((j) => j.status === key).length;
          return (
            <Link
              key={key}
              href={`/client/jobs?tab=${key}`}
              role="tab"
              aria-selected={tab === key}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
              style={
                tab === key
                  ? { background: "#fff", color: "#1c1917", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }
                  : { color: "#78716c" }
              }
            >
              {label}
              {count > 0 && <span className="ml-1.5 text-[10px] tabular-nums opacity-60">{count}</span>}
            </Link>
          );
        })}
      </div>
      </div>

      {/* List */}
      {jobs.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-12 text-center"
          style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          <div
            className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "rgba(217,119,6,0.08)" }}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
          </div>
          <p className="font-semibold text-stone-700 mb-1">
            {tab === "all" ? "No jobs yet" : `No ${tab.replace("_", " ")} jobs`}
          </p>
          <p className="text-sm text-stone-400 mb-5">
            {tab === "all"
              ? "Post your first job and receive quotes from verified workers."
              : `You don't have any ${tab.replace("_", " ")} jobs right now.`}
          </p>
          <Link
            href="/client/post-job"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-px"
            style={{ background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)", boxShadow: "0 2px 8px rgba(180,83,9,0.24)" }}
          >
            Post a job
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {jobs.map((job) => {
            const cfg = STATUS_CONFIG[job.status];
            const budget = job.budgetMinNgn === job.budgetMaxNgn
              ? formatNgn(job.budgetMinNgn)
              : `${formatNgn(job.budgetMinNgn)}–${formatNgn(job.budgetMaxNgn)}`;

            return (
              <li
                key={job.id}
                className="bg-white rounded-2xl p-5 transition-shadow hover:shadow-md"
                style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border"
                        style={{ background: cfg.bg, color: cfg.text, borderColor: "transparent" }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                        {cfg.label}
                      </span>
                      {job.urgency === "urgent" && (
                        <span className="text-[10px] font-bold uppercase tracking-wide text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                          Urgent
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/client/jobs/${job.id}`}
                      className="font-semibold text-stone-800 hover:text-amber-700 transition-colors leading-snug block"
                    >
                      {job.title}
                    </Link>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-stone-400">
                      <span>{job.category}</span>
                      <span>·</span>
                      <span>{job.location}</span>
                      <span>·</span>
                      <span>{timeAgo(job.postedAt)}</span>
                      {job.status === "open" && job.quotesCount > 0 && (
                        <>
                          <span>·</span>
                          <span className="font-medium text-amber-700">
                            {job.quotesCount} quote{job.quotesCount !== 1 ? "s" : ""}
                          </span>
                        </>
                      )}
                      {job.hiredWorkerName && (
                        <>
                          <span>·</span>
                          <span>Hired: <span className="font-medium text-stone-600">{job.hiredWorkerName}</span></span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-stone-800 tabular-nums whitespace-nowrap">{budget}</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">{job.category}</p>
                  </div>
                </div>

                {/* Actions */}
                {job.status === "open" && job.quotesCount > 0 && (
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                    <Link
                      href={`/client/jobs/${job.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                    >
                      Review {job.quotesCount} quote{job.quotesCount !== 1 ? "s" : ""}
                      <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M2 6h8M6 2l4 4-4 4" />
                      </svg>
                    </Link>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
