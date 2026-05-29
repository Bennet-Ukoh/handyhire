"use client";

import { useState } from "react";
import Link from "next/link";
import QuoteSubmitModal from "./QuoteSubmitModal";
import type { NearbyJob } from "@/lib/worker/types";

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
  return `${Math.max(m, 1)}m ago`;
}

interface Props {
  jobs: NearbyJob[];
  trade?: string;
}

export default function BrowseJobsView({ jobs, trade }: Props) {
  const [quoting, setQuoting] = useState<NearbyJob | null>(null);

  return (
    <>
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
          <p className="font-semibold text-stone-700 mb-1">No open jobs right now</p>
          <p className="text-sm text-stone-400">
            {trade
              ? `No ${trade} jobs are available near you yet — check back soon.`
              : "No open jobs are available right now — check back soon."}
          </p>
          <Link
            href="/worker/dashboard"
            className="inline-block mt-5 text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors"
          >
            ← Back to dashboard
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="bg-white rounded-2xl p-5 transition-shadow hover:shadow-md"
              style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {job.urgency === "urgent" && (
                      <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                        Urgent
                      </span>
                    )}
                    <span
                      className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(217,119,6,0.08)", color: "#92400e" }}
                    >
                      {job.trade}
                    </span>
                  </div>

                  <h2 className="font-display text-base font-semibold text-stone-900 leading-snug mb-1.5">
                    {job.title}
                  </h2>
                  <p className="text-sm text-stone-500 leading-relaxed line-clamp-2 mb-3">
                    {job.description}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-400">
                    <span className="flex items-center gap-1">
                      <svg viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="currentColor" aria-hidden="true">
                        <path d="M6 0C4.07 0 2.5 1.57 2.5 3.5c0 2.73 3.5 8.5 3.5 8.5s3.5-5.77 3.5-8.5C9.5 1.57 7.93 0 6 0zm0 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                      </svg>
                      {job.location}
                    </span>
                    <span>·</span>
                    <span suppressHydrationWarning>{timeAgo(job.postedAt)}</span>
                    {job.quotesCount > 0 && (
                      <>
                        <span>·</span>
                        <span>{job.quotesCount} quote{job.quotesCount !== 1 ? "s" : ""}</span>
                      </>
                    )}
                    <span>·</span>
                    <span className="text-stone-500">{job.clientName}</span>
                  </div>
                </div>

                {/* Right: budget + CTA */}
                <div className="shrink-0 flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-stone-800 tabular-nums whitespace-nowrap">
                      {formatNgn(job.budgetMinNgn)}
                      {job.budgetMinNgn !== job.budgetMaxNgn && `–${formatNgn(job.budgetMaxNgn)}`}
                    </p>
                    <p className="text-[10px] text-stone-400 mt-0.5">budget</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuoting(job)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:-translate-y-px whitespace-nowrap"
                    style={{
                      background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                      boxShadow: "0 2px 8px rgba(180,83,9,0.24)",
                    }}
                  >
                    Quote
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {quoting && (
        <QuoteSubmitModal job={quoting} onClose={() => setQuoting(null)} />
      )}
    </>
  );
}
