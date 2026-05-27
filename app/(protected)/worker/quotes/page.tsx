import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { findQuotesByWorkerId } from "@/lib/shared/quote-store";

export const metadata: Metadata = { title: "My Quotes — HandyHire" };

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

const STATUS_CONFIG = {
  pending:  { label: "Sent",     bg: "rgba(217,119,6,0.08)",  text: "#92400e", dot: "#d97706" },
  accepted: { label: "Accepted", bg: "rgba(16,185,129,0.08)", text: "#065f46", dot: "#10b981" },
  rejected: { label: "Rejected", bg: "rgba(239,68,68,0.06)",  text: "#b91c1c", dot: "#ef4444" },
  expired:  { label: "Expired",  bg: "rgba(0,0,0,0.04)",      text: "#78716c", dot: "#a8a29e" },
} as const;

type TabFilter = "all" | "pending" | "accepted" | "rejected";
const TABS: { key: TabFilter; label: string }[] = [
  { key: "all",      label: "All" },
  { key: "pending",  label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Declined" },
];

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function WorkerQuotesPage({ searchParams }: Props) {
  const session = await getSession();
  const { tab: rawTab } = await searchParams;
  const tab = (["all", "pending", "accepted", "rejected"].includes(rawTab ?? "") ? rawTab : "all") as TabFilter;

  const allQuotes = findQuotesByWorkerId(session!.userId);
  const quotes = tab === "all" ? allQuotes : allQuotes.filter((q) => {
    if (tab === "pending") return q.status === "pending";
    if (tab === "accepted") return q.status === "accepted";
    if (tab === "rejected") return q.status === "rejected" || q.status === "expired";
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-stone-900 leading-tight">My Quotes</h1>
        <p className="text-sm text-stone-500 mt-1">All quotes you&apos;ve submitted to clients.</p>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}
        role="tablist"
      >
        {TABS.map(({ key, label }) => {
          const count = key === "all"
            ? allQuotes.length
            : allQuotes.filter((q) => key === "rejected"
                ? q.status === "rejected" || q.status === "expired"
                : q.status === key
              ).length;

          return (
            <Link
              key={key}
              href={`/worker/quotes?tab=${key}`}
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
              {count > 0 && (
                <span className="ml-1.5 text-[10px] tabular-nums opacity-60">{count}</span>
              )}
            </Link>
          );
        })}
      </div>

      {quotes.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-12 text-center"
          style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          <div
            className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "rgba(217,119,6,0.08)" }}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
            </svg>
          </div>
          <p className="font-semibold text-stone-700 mb-1">
            {tab === "all" ? "No quotes yet" : `No ${tab} quotes`}
          </p>
          <p className="text-sm text-stone-400 mb-5">
            {tab === "all"
              ? "Browse jobs and send your first quote."
              : `You don't have any ${tab === "rejected" ? "declined" : tab} quotes.`}
          </p>
          {tab === "all" && (
            <Link
              href="/worker/jobs"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-px"
              style={{ background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)", boxShadow: "0 2px 8px rgba(180,83,9,0.24)" }}
            >
              Browse jobs
            </Link>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {quotes.map((quote) => {
            const cfg = STATUS_CONFIG[quote.status] ?? STATUS_CONFIG.expired;
            return (
              <li
                key={quote.id}
                className="bg-white rounded-2xl p-5"
                style={{
                  border: "1px solid rgba(0,0,0,0.07)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  opacity: quote.status === "rejected" || quote.status === "expired" ? 0.7 : 1,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    {/* Status */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                        style={{ background: cfg.bg, color: cfg.text }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                        {cfg.label}
                      </span>
                    </div>

                    <p className="font-semibold text-stone-800 leading-snug text-sm mb-1">
                      {quote.jobTitle}
                    </p>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-400 mt-1">
                      <span>{quote.clientName}</span>
                      <span>·</span>
                      <span>{quote.location}</span>
                      <span>·</span>
                      <span>{timeAgo(quote.submittedAt)}</span>
                    </div>

                    {quote.note && (
                      <p className="text-xs text-stone-500 italic mt-2 line-clamp-2">{quote.note}</p>
                    )}
                  </div>

                  <div className="shrink-0 text-right flex flex-col items-end gap-2">
                    <p className="text-base font-bold text-stone-900 tabular-nums whitespace-nowrap">
                      {formatNgn(quote.amountNgn)}
                    </p>

                    {quote.status === "accepted" && quote.conversationId && (
                      <Link
                        href={`/chat/${quote.conversationId}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                      >
                        Open chat
                        <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M2 6h8M6 2l4 4-4 4" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
