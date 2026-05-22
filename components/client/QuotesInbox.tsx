"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ReceivedQuote } from "@/lib/client/types";
import { acceptQuoteAction, declineQuoteAction } from "@/lib/client/actions";

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

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function StarRating({ value }: { value: number }) {
  const full = Math.floor(value);
  return (
    <span className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 10 10"
          className={`w-3 h-3 ${i <= full ? "text-amber-400" : "text-stone-200"}`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5 0l1.2 2.6 2.8.4-2 2 .5 2.8L5 6.5 2.5 7.8 3 5 1 3l2.8-.4L5 0z" />
        </svg>
      ))}
      <span className="text-xs font-semibold text-stone-700 ml-1">{value.toFixed(1)}</span>
    </span>
  );
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 1.5L2.5 4v4c0 3.1 2.4 5.4 5.5 6 3.1-.6 5.5-2.9 5.5-6V4L8 1.5z" />
      <path d="M5.5 8.5l2 2 3-3" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 1.5L1.5 13h13L8 1.5z" />
      <path d="M8 6v3.5M8 11.5h.01" />
    </svg>
  );
}

/* ── Quote card ─────────────────────────────────────────────────────── */

interface CardProps {
  quote: ReceivedQuote;
  onAccept: () => void;
  onDecline: () => void;
  isPending: boolean;
}

function QuoteCard({ quote, onAccept, onDecline, isPending }: CardProps) {
  const ini = initials(quote.workerName);
  const isAccepted = quote.status === "accepted";
  const isRejected = quote.status === "rejected";

  return (
    <article
      className="bg-white rounded-2xl flex flex-col overflow-hidden"
      style={{
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
        opacity: isRejected ? 0.6 : 1,
      }}
      aria-label={`Quote from ${quote.workerName}`}
    >
      {/* Job context */}
      <div
        className="px-4 py-2.5"
        style={{ background: "rgba(0,0,0,0.025)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <p className="text-[11px] text-stone-400 truncate">
          For: <span className="font-medium text-stone-600">{quote.jobTitle}</span>
        </p>
      </div>

      <div className="flex flex-col gap-4 p-4 flex-1">
        {/* Worker identity */}
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-amber-800 shrink-0"
            style={{ background: "linear-gradient(135deg, #fef3c7, #fcd34d)" }}
            aria-hidden="true"
          >
            {ini}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-stone-800 leading-tight">
                {quote.workerName}
              </p>
              {quote.workerIsVerified ? (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full"
                  style={{ background: "rgba(16,185,129,0.09)", color: "#065f46" }}
                  title="Identity and background verified"
                >
                  <ShieldCheckIcon />
                  Verified
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full"
                  style={{ background: "rgba(245,158,11,0.1)", color: "#92400e" }}
                  title="Verification pending"
                >
                  <WarningIcon />
                  Unverified
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <StarRating value={quote.workerAverageRating} />
              <span className="text-[11px] text-stone-400">
                {quote.workerReviewCount} review{quote.workerReviewCount !== 1 ? "s" : ""}
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-[11px] text-stone-500 font-medium">{quote.workerTrade}</span>
            </div>
          </div>
        </div>

        {/* Note */}
        {quote.note && (
          <p className="text-xs text-stone-500 leading-relaxed line-clamp-3 italic">
            &ldquo;{quote.note}&rdquo;
          </p>
        )}

        {/* Amount + time */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div>
            <p className="text-[11px] text-stone-400 uppercase tracking-wide font-medium">
              Quoted
            </p>
            <p className="text-xl font-bold text-stone-900 tabular-nums leading-tight">
              {formatNgn(quote.amountNgn)}
            </p>
          </div>
          <p className="text-xs text-stone-400">{timeAgo(quote.submittedAt)}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          {isAccepted ? (
            <>
              <span
                className="flex-1 text-center text-sm font-semibold py-2.5 rounded-xl"
                style={{ background: "rgba(16,185,129,0.09)", color: "#065f46" }}
              >
                ✓ Accepted
              </span>
              {quote.conversationId && (
                <Link
                  href={`/chat/${quote.conversationId}`}
                  className="flex-1 text-center text-sm font-semibold py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors duration-150"
                >
                  Open chat
                </Link>
              )}
            </>
          ) : isRejected ? (
            <span className="flex-1 text-center text-sm text-stone-400 py-2.5">
              Declined
            </span>
          ) : (
            <>
              <button
                type="button"
                onClick={onAccept}
                disabled={isPending}
                className="flex-1 text-sm font-semibold text-white py-2.5 rounded-xl transition-all duration-150 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                  boxShadow: "0 2px 8px rgba(180,83,9,0.22)",
                }}
              >
                Accept
              </button>
              <button
                type="button"
                onClick={onDecline}
                disabled={isPending}
                className="flex-1 text-sm font-medium text-stone-500 hover:text-stone-800 py-2.5 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Decline
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

/* ── Inbox container ────────────────────────────────────────────────── */

interface Props {
  quotes: ReceivedQuote[];
}

export default function QuotesInbox({ quotes }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleAccept(quoteId: string) {
    startTransition(async () => {
      await acceptQuoteAction(quoteId);
      router.refresh();
    });
  }

  function handleDecline(quoteId: string) {
    startTransition(async () => {
      await declineQuoteAction(quoteId);
      router.refresh();
    });
  }

  if (quotes.length === 0) {
    return (
      <div
        className="bg-white rounded-2xl px-6 py-10 text-center"
        style={{
          border: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.04)" }}
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-stone-400" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 3h16v11H2zM6 17h8M10 14v3" />
            <path d="M6 8l2 2 4-4" />
          </svg>
        </div>
        <p className="text-sm font-medium text-stone-500">No quotes yet</p>
        <p className="text-xs text-stone-400 mt-1 max-w-[28ch] mx-auto">
          Workers will send quotes after you post a job.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {quotes.map((q) => (
        <QuoteCard
          key={q.id}
          quote={q}
          onAccept={() => handleAccept(q.id)}
          onDecline={() => handleDecline(q.id)}
          isPending={isPending}
        />
      ))}
    </div>
  );
}
