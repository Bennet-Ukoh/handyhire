import type { Metadata } from "next";
import { getSession } from "@/lib/auth/session";
import { getWorkerProfile } from "@/lib/worker/service";
import { findQuotesByWorkerId } from "@/lib/shared/quote-store";

export const metadata: Metadata = { title: "Earnings — HandyHire" };

function formatNgn(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}k`;
  return `₦${amount.toLocaleString()}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

function StatCard({ label, value, sub, accent = "#1c1917" }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div
      className="bg-white rounded-2xl p-5"
      style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-2">{label}</p>
      <p className="font-display text-2xl font-bold" style={{ color: accent }}>{value}</p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </div>
  );
}

export default async function WorkerEarningsPage() {
  const session = await getSession();
  const [profile, allQuotes] = await Promise.all([
    getWorkerProfile(session!.userId),
    Promise.resolve(findQuotesByWorkerId(session!.userId)),
  ]);

  const acceptedQuotes = allQuotes.filter((q) => q.status === "accepted");
  const totalEarned = acceptedQuotes.reduce((sum, q) => sum + q.amountNgn, 0);
  const avgPerJob = acceptedQuotes.length > 0 ? Math.round(totalEarned / acceptedQuotes.length) : 0;
  const pendingCount = allQuotes.filter((q) => q.status === "pending").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-stone-900 leading-tight">Earnings</h1>
        <p className="text-sm text-stone-500 mt-1">Your earnings history and payment summary.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Earned"
          value={formatNgn(totalEarned || profile.stats.totalEarningsNgn)}
          sub="all time"
          accent="#b45309"
        />
        <StatCard
          label="Jobs Completed"
          value={String(profile.stats.jobsCompleted || acceptedQuotes.length)}
          sub="accepted quotes"
        />
        <StatCard
          label="Avg Per Job"
          value={formatNgn(avgPerJob)}
          sub="across accepted quotes"
        />
        <StatCard
          label="Response Rate"
          value={`${profile.stats.responseRatePercent}%`}
          sub="quotes accepted"
        />
      </div>

      {/* Pending quotes notice */}
      {pendingCount > 0 && (
        <div
          className="rounded-2xl px-5 py-4 flex items-start gap-3"
          style={{
            background: "rgba(217,119,6,0.05)",
            border: "1px solid rgba(217,119,6,0.2)",
          }}
        >
          <svg viewBox="0 0 20 20" className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-12a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l2.828 2.829a1 1 0 1 0 1.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {pendingCount} quote{pendingCount !== 1 ? "s" : ""} awaiting client response
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Earnings from these quotes will appear here once accepted.
            </p>
          </div>
        </div>
      )}

      {/* Activity list */}
      <section>
        <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-3">
          Recent Activity
        </p>

        {acceptedQuotes.length === 0 ? (
          <div
            className="bg-white rounded-2xl p-10 text-center"
            style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
          >
            <p className="font-semibold text-stone-600 mb-1">No completed jobs yet</p>
            <p className="text-sm text-stone-400">Accepted quotes will appear here as your activity history.</p>
          </div>
        ) : (
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
          >
            <ul className="divide-y" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
              {acceptedQuotes.map((quote) => (
                <li key={quote.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-stone-800 leading-snug">{quote.jobTitle}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-400">
                      <span>{quote.clientName}</span>
                      <span>·</span>
                      <span>{formatDate(quote.submittedAt)}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-emerald-700 tabular-nums">
                      +{formatNgn(quote.amountNgn)}
                    </p>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(16,185,129,0.08)", color: "#065f46" }}
                    >
                      Accepted
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Payments note */}
      <p className="text-xs text-stone-400 text-center">
        Payment processing and withdrawal features are coming soon. Figures shown reflect accepted quotes.
      </p>
    </div>
  );
}
