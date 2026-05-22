"use client";

import { useActionState, useEffect } from "react";
import { submitQuoteAction } from "@/lib/worker/actions";
import type { ActionState } from "@/lib/auth/types";
import type { NearbyJob } from "@/lib/worker/types";

function formatNgn(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}k`;
  return `₦${amount.toLocaleString()}`;
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

interface Props {
  job: NearbyJob;
  onClose: () => void;
}

export default function QuoteSubmitModal({ job, onClose }: Props) {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    submitQuoteAction,
    null
  );

  // Close on success (empty state with no error)
  useEffect(() => {
    if (state !== null && !state.error) {
      onClose();
    }
  }, [state, onClose]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const fe = state?.fieldErrors ?? {};

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-modal-title"
        style={{
          background: "#FFFFFF",
          boxShadow: "0 24px 48px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        {/* Job header strip */}
        <div
          className="px-6 py-4"
          style={{ background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-1">
            Submitting quote for
          </p>
          <h2 id="quote-modal-title" className="font-display text-lg text-stone-900 leading-snug">
            {job.title}
          </h2>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-stone-500">
            <span>{job.location}</span>
            <span>·</span>
            <span className="font-medium text-stone-700">
              {formatNgn(job.budgetMinNgn)}–{formatNgn(job.budgetMaxNgn)} budget
            </span>
          </div>
        </div>

        {/* Form */}
        <form action={formAction} noValidate className="p-6 space-y-5">
          <input type="hidden" name="jobId" value={job.id} />

          {/* Error */}
          {state?.error && (
            <div
              className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm"
              role="alert"
              style={{
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.18)",
                color: "#b91c1c",
              }}
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" aria-hidden="true">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.5h1.5v5h-1.5v-5zm0 6h1.5v1.5h-1.5V10.5z" />
              </svg>
              {state.error}
            </div>
          )}

          {/* Amount */}
          <div>
            <label htmlFor="quote-amount" className="block text-sm font-medium text-stone-700 mb-1.5">
              Your quote amount (₦) <span className="text-red-500">*</span>
            </label>
            <input
              id="quote-amount"
              name="amountNgn"
              type="number"
              min={500}
              step={500}
              required
              placeholder="e.g. 15000"
              className={`w-full px-4 py-3 rounded-xl border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none transition-colors duration-150 ${
                fe.amountNgn
                  ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50/30"
                  : "border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-white"
              }`}
            />
            {fe.amountNgn && <p className="text-xs text-red-600 mt-1">{fe.amountNgn}</p>}
          </div>

          {/* Note */}
          <div>
            <label htmlFor="quote-note" className="block text-sm font-medium text-stone-700 mb-1.5">
              Message to client{" "}
              <span className="text-stone-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="quote-note"
              name="note"
              rows={3}
              maxLength={500}
              placeholder="Describe your approach, availability, or why you're a good fit…"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-colors duration-150 resize-none"
            />
            {fe.note && <p className="text-xs text-red-600 mt-1">{fe.note}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 py-3 rounded-xl border border-stone-200 text-sm font-semibold text-stone-600 hover:bg-stone-50 disabled:opacity-50 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-px"
              style={{
                background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                boxShadow: "0 4px 12px rgba(180,83,9,0.28)",
              }}
            >
              {isPending ? (
                <>
                  <Spinner />
                  Sending…
                </>
              ) : (
                "Send quote"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
