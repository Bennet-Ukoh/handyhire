"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { postJobAction } from "@/lib/client/actions";
import type { PostJobState } from "@/lib/client/actions";
import { TRADE_CATEGORIES } from "@/lib/shared/types";
import PhotoCapture from "@/components/shared/PhotoCapture";
import LocationCapture from "@/components/shared/LocationCapture";

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-600 mt-1">{message}</p>;
}

const SECTION_LABEL = "block text-sm font-medium text-stone-700 mb-1.5";
const INPUT_BASE =
  "w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-colors duration-150";
const INPUT_ERROR =
  "w-full px-4 py-3 rounded-xl border border-red-300 bg-red-50/30 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-colors duration-150";

/* ── Success screen ─────────────────────────────────────────────────── */

function PostJobSuccess({ jobTitle, jobId }: { jobTitle: string; jobId: string }) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Success card */}
      <div
        className="rounded-2xl p-8 text-center space-y-4"
        style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.04) 0%, rgba(5,150,105,0.06) 100%)",
          border: "1px solid rgba(16,185,129,0.2)",
          boxShadow: "0 4px 24px rgba(16,185,129,0.08)",
        }}
      >
        {/* Checkmark */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ background: "rgba(16,185,129,0.12)", border: "2px solid rgba(16,185,129,0.3)" }}
        >
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div>
          <h2 className="text-xl font-bold text-stone-900">Your job has been posted!</h2>
          <p className="text-stone-600 text-sm mt-1 font-medium">&ldquo;{jobTitle}&rdquo;</p>
        </div>

        <p className="text-xs text-stone-500">Job ID: {jobId}</p>
      </div>

      {/* Next steps */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
      >
        <p className="text-sm font-semibold text-stone-800">What happens next?</p>
        <ul className="space-y-3">
          {[
            {
              icon: (
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-7 9a7 7 0 1 1 14 0H3z" />
                </svg>
              ),
              text: "Verified workers in your area who match your job category are being notified right now.",
              color: "#3b82f6",
            },
            {
              icon: (
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10c0 4.418-3.582 8-8 8S2 14.418 2 10 5.582 2 10 2s8 3.582 8 8zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              ),
              text: "You'll receive quotes from interested workers to review in your dashboard.",
              color: "#d97706",
            },
            {
              icon: (
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 0 0 1.745-.723 3.066 3.066 0 0 1 3.976 0 3.066 3.066 0 0 0 1.745.723 3.066 3.066 0 0 1 2.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 0 1 0 3.976 3.066 3.066 0 0 0-.723 1.745 3.066 3.066 0 0 1-2.812 2.812 3.066 3.066 0 0 0-1.745.723 3.066 3.066 0 0 1-3.976 0 3.066 3.066 0 0 0-1.745-.723 3.066 3.066 0 0 1-2.812-2.812 3.066 3.066 0 0 0-.723-1.745 3.066 3.066 0 0 1 0-3.976 3.066 3.066 0 0 0 .723-1.745 3.066 3.066 0 0 1 2.812-2.812zm7.44 5.252a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ),
              text: "Only admin-verified workers can quote on your job — every worker has been identity checked.",
              color: "#10b981",
            },
          ].map(({ icon, text, color }, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-white"
                style={{ background: color }}
              >
                {icon}
              </span>
              <p className="text-sm text-stone-600 leading-relaxed">{text}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => router.push("/client/dashboard")}
          className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white
            py-3.5 rounded-xl transition-all duration-150 hover:-translate-y-px"
          style={{
            background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
            boxShadow: "0 4px 16px rgba(180,83,9,0.28)",
          }}
        >
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="3" width="12" height="10" rx="1" />
            <path d="M2 6h12" />
          </svg>
          View my dashboard
        </button>

        <button
          type="button"
          onClick={() => router.push("/client/post-job")}
          className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold text-stone-700
            py-3.5 rounded-xl transition-all duration-150 hover:bg-stone-100"
          style={{ border: "1px solid rgba(0,0,0,0.12)" }}
        >
          Post another job
        </button>
      </div>
    </div>
  );
}

/* ── Main form ──────────────────────────────────────────────────────── */

export default function PostJobForm() {
  const [state, formAction, isPending] = useActionState<PostJobState | null, FormData>(
    postJobAction,
    null
  );

  if (state?.success && state.jobId && state.jobTitle) {
    return <PostJobSuccess jobId={state.jobId} jobTitle={state.jobTitle} />;
  }

  const fe = state?.fieldErrors ?? {};

  return (
    <form action={formAction} noValidate className="space-y-6">
      {/* Global error banner */}
      {state?.error && !Object.keys(fe).length && (
        <div
          className="flex items-start gap-2.5 rounded-xl px-4 py-3.5 text-sm"
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

      {/* Card shell */}
      <div
        className="rounded-2xl border p-6 space-y-6"
        style={{
          background: "#FFFFFF",
          borderColor: "rgba(0,0,0,0.07)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* Job title */}
        <div>
          <label htmlFor="title" className={SECTION_LABEL}>
            Job title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. Fix leaking bathroom pipes"
            className={fe.title ? INPUT_ERROR : INPUT_BASE}
          />
          <FieldError message={fe.title} />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className={SECTION_LABEL}>
            Trade category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue=""
            className={`${fe.category ? INPUT_ERROR : INPUT_BASE} appearance-none cursor-pointer`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%2378716c' d='M8 10.5L3 5.5h10L8 10.5z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
              backgroundSize: "16px",
            }}
          >
            <option value="" disabled>Select a category</option>
            {TRADE_CATEGORIES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <FieldError message={fe.category} />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={SECTION_LABEL}>
            Describe the job <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="Describe the problem clearly so workers can quote accurately…"
            className={`${fe.description ? INPUT_ERROR : INPUT_BASE} resize-none`}
          />
          <FieldError message={fe.description} />
        </div>
      </div>

      {/* Budget */}
      <div
        className="rounded-2xl border p-6"
        style={{
          background: "#FFFFFF",
          borderColor: "rgba(0,0,0,0.07)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        <p className={SECTION_LABEL}>
          Budget range (₦) <span className="text-red-500">*</span>
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="budgetMinNgn" className="block text-xs text-stone-500 mb-1.5">
              Minimum
            </label>
            <input
              id="budgetMinNgn"
              name="budgetMinNgn"
              type="number"
              min={1000}
              step={500}
              required
              placeholder="5,000"
              className={fe.budgetMinNgn ? INPUT_ERROR : INPUT_BASE}
            />
            <FieldError message={fe.budgetMinNgn} />
          </div>
          <div>
            <label htmlFor="budgetMaxNgn" className="block text-xs text-stone-500 mb-1.5">
              Maximum
            </label>
            <input
              id="budgetMaxNgn"
              name="budgetMaxNgn"
              type="number"
              min={1000}
              step={500}
              required
              placeholder="25,000"
              className={fe.budgetMaxNgn ? INPUT_ERROR : INPUT_BASE}
            />
            <FieldError message={fe.budgetMaxNgn} />
          </div>
        </div>
      </div>

      {/* Urgency + Location */}
      <div
        className="rounded-2xl border p-6 space-y-5"
        style={{
          background: "#FFFFFF",
          borderColor: "rgba(0,0,0,0.07)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* Urgency toggle */}
        <div>
          <p className={SECTION_LABEL}>How urgent is this?</p>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Urgency">
            {(
              [
                {
                  value: "normal" as const,
                  label: "Normal",
                  sub: "Within a few days",
                  icon: (
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
                      <circle cx="10" cy="10" r="8" />
                      <path d="M10 6v4l2.5 2.5" />
                    </svg>
                  ),
                },
                {
                  value: "urgent" as const,
                  label: "Urgent",
                  sub: "As soon as possible",
                  icon: (
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
                      <path d="M10 2L2 18h16L10 2z" />
                      <path d="M10 8v4" />
                      <circle cx="10" cy="14.5" r="0.5" fill="currentColor" />
                    </svg>
                  ),
                },
              ] as const
            ).map(({ value, label, sub, icon }) => (
              <label
                key={value}
                className="flex flex-col gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all duration-150 has-[:checked]:border-amber-400 has-[:checked]:bg-amber-50 border-stone-200 hover:border-stone-300 hover:bg-stone-50/50"
              >
                <input type="radio" name="urgency" value={value} defaultChecked={value === "normal"} className="sr-only" />
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-100 text-stone-500 transition-colors duration-150">
                  {icon}
                </span>
                <span className="text-sm font-semibold text-stone-900">{label}</span>
                <span className="text-xs text-stone-400">{sub}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className={SECTION_LABEL}>
            Job location <span className="text-red-500">*</span>
          </label>
          <LocationCapture fieldError={fe.location} />
        </div>
      </div>

      {/* Photos */}
      <div
        className="rounded-2xl border p-6"
        style={{
          background: "#FFFFFF",
          borderColor: "rgba(0,0,0,0.07)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        <p className={SECTION_LABEL}>
          Photos{" "}
          <span className="text-stone-400 font-normal">(optional — helps workers quote accurately)</span>
        </p>
        <PhotoCapture maxPhotos={4} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full inline-flex items-center justify-center gap-2 font-semibold text-sm text-white py-4 rounded-xl transition-all duration-200 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        style={{
          background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
          boxShadow: "0 4px 16px rgba(180,83,9,0.28), 0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {isPending ? (
          <>
            <Spinner />
            Posting job…
          </>
        ) : (
          "Post job and find workers"
        )}
      </button>
    </form>
  );
}
