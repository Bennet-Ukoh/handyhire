"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeJobAction } from "@/lib/client/actions";
import type { ClientJob, JobStatus } from "@/lib/client/types";

/* ── Status config ──────────────────────────────────────────────────── */

interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
}

const STATUS_CONFIG: Record<JobStatus, StatusConfig> = {
  draft: {
    label: "Draft",
    bg:     "rgba(0,0,0,0.04)",
    text:   "#78716c",
    border: "rgba(0,0,0,0.08)",
    dot:    "#a8a29e",
  },
  open: {
    label: "Open",
    bg:     "rgba(217,119,6,0.08)",
    text:   "#92400e",
    border: "rgba(217,119,6,0.2)",
    dot:    "#d97706",
  },
  in_progress: {
    label: "In Progress",
    bg:     "rgba(59,130,246,0.08)",
    text:   "#1d4ed8",
    border: "rgba(59,130,246,0.18)",
    dot:    "#3b82f6",
  },
  completed: {
    label: "Completed",
    bg:     "rgba(16,185,129,0.08)",
    text:   "#065f46",
    border: "rgba(16,185,129,0.18)",
    dot:    "#10b981",
  },
  cancelled: {
    label: "Cancelled",
    bg:     "rgba(239,68,68,0.06)",
    text:   "#b91c1c",
    border: "rgba(239,68,68,0.14)",
    dot:    "#ef4444",
  },
};

/* ── Helpers ────────────────────────────────────────────────────────── */

function formatNgn(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}k`;
  return `₦${amount.toLocaleString()}`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor(diff / 60_000);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return `${m}m ago`;
}

function LocationPinIcon() {
  return (
    <svg viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="currentColor" aria-hidden="true">
      <path d="M6 0C4.07 0 2.5 1.57 2.5 3.5c0 2.73 3.5 8.5 3.5 8.5s3.5-5.77 3.5-8.5C9.5 1.57 7.93 0 6 0zm0 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
    </svg>
  );
}

/* ── Mark Complete button ───────────────────────────────────────────── */

function MarkCompleteButton({ jobId }: { jobId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await completeJobAction(jobId);
          router.refresh();
        })
      }
      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700
        hover:text-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isPending ? (
        <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ) : (
        <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 6.5l2.5 2.5 5.5-5.5" />
        </svg>
      )}
      {isPending ? "Completing…" : "Mark complete"}
    </button>
  );
}

/* ── Component ──────────────────────────────────────────────────────── */

interface Props {
  jobs: ClientJob[];
}

export default function JobsPanel({ jobs }: Props) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div>
          <h3 className="text-sm font-semibold text-stone-800">Your jobs</h3>
          <p className="text-xs text-stone-400 mt-0.5">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} posted
          </p>
        </div>
        <Link
          href="/client/jobs"
          className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
        >
          See all
        </Link>
      </div>

      {/* List */}
      {jobs.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-stone-400">No jobs posted yet.</p>
        </div>
      ) : (
        <ul className="divide-y" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
          {jobs.map((job) => {
            const cfg = STATUS_CONFIG[job.status];
            const budget =
              job.budgetMinNgn === job.budgetMaxNgn
                ? formatNgn(job.budgetMinNgn)
                : `${formatNgn(job.budgetMinNgn)}–${formatNgn(job.budgetMaxNgn)}`;

            return (
              <li
                key={job.id}
                className="group px-5 py-4 hover:bg-stone-50/60 transition-colors duration-100"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: status + title */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border"
                        style={{
                          background: cfg.bg,
                          color: cfg.text,
                          borderColor: cfg.border,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: cfg.dot }}
                        />
                        {cfg.label}
                      </span>

                      {job.urgency === "urgent" && (
                        <span className="text-[10px] font-bold uppercase tracking-wide text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                          Urgent
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-stone-800 leading-snug">
                      {job.title}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-stone-400">
                      <span className="flex items-center gap-1">
                        <LocationPinIcon />
                        {job.location}
                      </span>
                      <span>·</span>
                      <span suppressHydrationWarning>{timeAgo(job.postedAt)}</span>

                      {job.status === "open" && job.quotesCount > 0 && (
                        <>
                          <span>·</span>
                          <span className="font-medium text-amber-700">
                            {job.quotesCount} quote{job.quotesCount !== 1 ? "s" : ""} received
                          </span>
                        </>
                      )}

                      {job.hiredWorkerName && (
                        <>
                          <span>·</span>
                          <span className="text-stone-500">
                            Hired: <span className="font-medium">{job.hiredWorkerName}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right: budget + category */}
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-stone-800 tabular-nums whitespace-nowrap">
                      {budget}
                    </p>
                    <p className="text-[10px] text-stone-400 mt-0.5">{job.category}</p>
                  </div>
                </div>

                {/* Actions */}
                {job.status === "open" && job.quotesCount > 0 && (
                  <div className="mt-2.5">
                    <Link
                      href={`/client/jobs/${job.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                    >
                      Review quotes
                      <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M2 6h8M6 2l4 4-4 4" />
                      </svg>
                    </Link>
                  </div>
                )}

                {job.status === "in_progress" && (
                  <div className="mt-2.5">
                    <MarkCompleteButton jobId={job.id} />
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
