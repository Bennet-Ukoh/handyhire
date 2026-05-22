import Link from "next/link";
import type { ActiveQuote, QuoteStatus } from "@/lib/worker/types";

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

const QUOTE_STATUS_CONFIG: Record<
  QuoteStatus,
  { label: string; bg: string; text: string }
> = {
  sent:     { label: "Sent",     bg: "rgba(217,119,6,0.08)",  text: "#92400e" },
  accepted: { label: "Accepted", bg: "rgba(16,185,129,0.08)", text: "#065f46" },
  rejected: { label: "Declined", bg: "rgba(239,68,68,0.07)",  text: "#b91c1c" },
  expired:  { label: "Expired",  bg: "rgba(0,0,0,0.05)",      text: "#78716c" },
};

interface Props {
  quotes: ActiveQuote[];
}

export default function QuotesPanel({ quotes }: Props) {
  return (
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
          <h3 className="text-sm font-semibold text-stone-800">Active quotes</h3>
          <p className="text-xs text-stone-400 mt-0.5">{quotes.length} sent</p>
        </div>
        <button
          type="button"
          className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
        >
          View all
        </button>
      </div>

      {/* List */}
      {quotes.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-stone-400">No active quotes yet.</p>
          <p className="text-xs text-stone-400 mt-1">
            Browse nearby jobs and send your first quote.
          </p>
        </div>
      ) : (
        <ul className="divide-y" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
          {quotes.map((q) => {
            const cfg = QUOTE_STATUS_CONFIG[q.status];
            return (
              <li key={q.id} className="px-5 py-3.5 hover:bg-stone-50/50 transition-colors duration-100">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-medium text-stone-800 leading-snug line-clamp-1">
                    {q.jobTitle}
                  </p>
                  <span
                    className="shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                    style={{ background: cfg.bg, color: cfg.text }}
                  >
                    {cfg.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-stone-400 truncate">{q.clientName}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-stone-400">{timeAgo(q.submittedAt)}</span>
                    <span className="text-sm font-bold text-stone-800 tabular-nums">
                      {formatNgn(q.amountNgn)}
                    </span>
                  </div>
                </div>
                {q.status === "accepted" && q.conversationId && (
                  <div className="mt-2">
                    <Link
                      href={`/chat/${q.conversationId}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                    >
                      <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14 8c0 3.3-2.7 6-6 6a6.1 6.1 0 0 1-2.9-.7L1 15l1.7-4A5.9 5.9 0 0 1 2 8c0-3.3 2.7-6 6-6s6 2.7 6 6z" />
                      </svg>
                      Open chat
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
