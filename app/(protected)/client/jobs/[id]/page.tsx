import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { findJobById } from "@/lib/client/mock-store";
import { findQuotesByJobId } from "@/lib/shared/quote-store";
import { getVerification } from "@/lib/worker/verification-store";
import QuotesInbox from "@/components/client/QuotesInbox";
import type { ReceivedQuote } from "@/lib/client/types";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = findJobById(id);
  return { title: job ? `${job.title} — HandyHire` : "Job — HandyHire" };
}

function formatNgn(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}k`;
  return `₦${amount.toLocaleString()}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

const STATUS_CONFIG = {
  draft:       { label: "Draft",       bg: "rgba(0,0,0,0.04)",         text: "#78716c", dot: "#a8a29e" },
  open:        { label: "Open",        bg: "rgba(217,119,6,0.08)",      text: "#92400e", dot: "#d97706" },
  in_progress: { label: "In Progress", bg: "rgba(59,130,246,0.08)",     text: "#1d4ed8", dot: "#3b82f6" },
  completed:   { label: "Completed",   bg: "rgba(16,185,129,0.08)",     text: "#065f46", dot: "#10b981" },
  cancelled:   { label: "Cancelled",   bg: "rgba(239,68,68,0.06)",      text: "#b91c1c", dot: "#ef4444" },
} as const;

function isWorkerVerified(workerId: string): boolean {
  const v = getVerification(workerId);
  return v.nin.status === "verified" && v.backgroundCheck.status === "verified";
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: Props) {
  const [session, { id }] = await Promise.all([getSession(), params]);
  const job = findJobById(id);

  if (!job || job.clientId !== session!.userId) notFound();

  const rawQuotes = findQuotesByJobId(id);
  const quotes: ReceivedQuote[] = rawQuotes.map((q) => ({
    id: q.id,
    jobId: q.jobId,
    jobTitle: q.jobTitle,
    workerId: q.workerId,
    workerName: q.workerName,
    workerTrade: q.workerTrade,
    workerAverageRating: q.workerAverageRating,
    workerReviewCount: q.workerReviewCount,
    workerIsVerified: isWorkerVerified(q.workerId),
    amountNgn: q.amountNgn,
    status: q.status as ReceivedQuote["status"],
    submittedAt: q.submittedAt,
    note: q.note,
    conversationId: q.conversationId,
  }));

  const cfg = STATUS_CONFIG[job.status];
  const budget = job.budgetMinNgn === job.budgetMaxNgn
    ? formatNgn(job.budgetMinNgn)
    : `${formatNgn(job.budgetMinNgn)} – ${formatNgn(job.budgetMaxNgn)}`;

  const pendingQuotes = quotes.filter((q) => q.status === "pending");
  const acceptedQuote = quotes.find((q) => q.status === "accepted");

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-400" aria-label="Breadcrumb">
        <Link href="/client/jobs" className="hover:text-stone-600 transition-colors">My Jobs</Link>
        <span aria-hidden="true">›</span>
        <span className="text-stone-600 truncate max-w-[20ch]">{job.title}</span>
      </nav>

      {/* Job detail card */}
      <div
        className="bg-white rounded-2xl p-6"
        style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                style={{ background: cfg.bg, color: cfg.text }}
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
            <h1 className="font-display text-xl md:text-2xl text-stone-900 leading-tight">{job.title}</h1>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-lg font-bold text-stone-900 tabular-nums">{budget}</p>
            <p className="text-xs text-stone-400 mt-0.5">budget</p>
          </div>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 text-sm">
          {[
            { label: "Category",  value: job.category },
            { label: "Location",  value: job.location },
            { label: "Posted",    value: formatDate(job.postedAt) },
            { label: "Quotes",    value: String(job.quotesCount) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl px-3 py-2.5" style={{ background: "rgba(0,0,0,0.025)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-stone-700">{value}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }} className="pt-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-2">Description</p>
          <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
        </div>

        {/* Hired worker / completion info */}
        {job.hiredWorkerName && (
          <div
            className="mt-4 pt-4 flex items-center gap-3"
            style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
          >
            <div
              className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-amber-800"
              style={{ background: "linear-gradient(135deg, #fef3c7, #fcd34d)" }}
              aria-hidden="true"
            >
              {job.hiredWorkerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-stone-400">
                {job.status === "completed" ? "Completed by" : "Assigned to"}
              </p>
              <p className="text-sm font-semibold text-stone-800">{job.hiredWorkerName}</p>
            </div>
            {acceptedQuote?.conversationId && (
              <Link
                href={`/chat/${acceptedQuote.conversationId}`}
                className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
              >
                Open chat
                <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 6h8M6 2l4 4-4 4" />
                </svg>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Quotes section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
              Received Quotes
            </p>
            <p className="text-sm text-stone-500 mt-0.5">
              {quotes.length === 0
                ? "No quotes yet — workers will respond soon."
                : pendingQuotes.length > 0
                  ? `${pendingQuotes.length} quote${pendingQuotes.length !== 1 ? "s" : ""} awaiting your decision`
                  : `${quotes.length} quote${quotes.length !== 1 ? "s" : ""} received`}
            </p>
          </div>
        </div>

        <QuotesInbox quotes={quotes} />
      </section>
    </div>
  );
}
