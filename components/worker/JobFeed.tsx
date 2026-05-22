"use client";

import { useState } from "react";
import type { NearbyJob } from "@/lib/worker/types";
import QuoteSubmitModal from "./QuoteSubmitModal";

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
  if (m > 0) return `${m}m ago`;
  return "Just now";
}

function LocationPinIcon() {
  return (
    <svg viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="currentColor" aria-hidden="true">
      <path d="M6 0C4.07 0 2.5 1.57 2.5 3.5c0 2.73 3.5 8.5 3.5 8.5s3.5-5.77 3.5-8.5C9.5 1.57 7.93 0 6 0zm0 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
    </svg>
  );
}

interface Props {
  jobs: NearbyJob[];
}

export default function JobFeed({ jobs }: Props) {
  const [selectedJob, setSelectedJob] = useState<NearbyJob | null>(null);

  return (
    <>
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          border: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div>
            <h3 className="text-sm font-semibold text-stone-800">Nearby jobs</h3>
            <p className="text-xs text-stone-400 mt-0.5">{jobs.length} matching your trade</p>
          </div>
          <button
            type="button"
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
          >
            Browse all
          </button>
        </div>

        {/* List */}
        {jobs.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div
              className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.04)" }}
            >
              <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-stone-400" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <circle cx="9" cy="9" r="6" />
                <path d="M15 15l3 3" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm font-medium text-stone-500">No jobs near you yet</p>
            <p className="text-xs text-stone-400 mt-1">Check back later or update your service location.</p>
          </div>
        ) : (
          <ul className="divide-y" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
            {jobs.map((job) => (
              <li
                key={job.id}
                className="group px-5 py-4 hover:bg-stone-50/60 transition-colors duration-100"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  {/* Title + urgency */}
                  <div className="flex items-start gap-2 min-w-0">
                    {job.urgency === "urgent" && (
                      <span className="shrink-0 mt-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                        Urgent
                      </span>
                    )}
                    <p className="text-sm font-semibold text-stone-800 leading-snug capitalize">
                      {job.title}
                    </p>
                  </div>

                  {/* Budget */}
                  <span className="shrink-0 text-sm font-bold text-stone-800 tabular-nums whitespace-nowrap">
                    {formatNgn(job.budgetMinNgn)}–{formatNgn(job.budgetMaxNgn)}
                  </span>
                </div>

                {/* Description snippet */}
                {job.description && (
                  <p className="text-xs text-stone-500 mb-2 line-clamp-1">{job.description}</p>
                )}

                {/* Meta row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-xs text-stone-400 min-w-0">
                    <span className="flex items-center gap-1 truncate">
                      <LocationPinIcon />
                      {job.location}
                    </span>
                    {job.distanceKm != null && (
                      <>
                        <span className="shrink-0">·</span>
                        <span className="shrink-0">{job.distanceKm} km away</span>
                      </>
                    )}
                    <span className="shrink-0">·</span>
                    <span className="shrink-0">{timeAgo(job.postedAt)}</span>
                    {job.quotesCount > 0 && (
                      <>
                        <span className="shrink-0">·</span>
                        <span className="shrink-0">{job.quotesCount} quote{job.quotesCount !== 1 ? "s" : ""}</span>
                      </>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    type="button"
                    onClick={() => setSelectedJob(job)}
                    className="shrink-0 text-xs font-semibold text-amber-700 hover:text-amber-800 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-150 flex items-center gap-1"
                  >
                    Quote
                    <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M2 6h8M6 2l4 4-4 4" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quote modal */}
      {selectedJob && (
        <QuoteSubmitModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </>
  );
}
