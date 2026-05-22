"use client";

import { useActionState } from "react";
import { startBackgroundCheckAction } from "@/lib/worker/verification-actions";
import type { ActionState } from "@/lib/auth/types";

type State = ActionState & { success?: boolean };

function Spinner() {
  return (
    <svg
      className="w-4 h-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

const CHECK_ITEMS = [
  { label: "Identity verification", sub: "Cross-checked against NIMC database" },
  { label: "Criminal record check", sub: "Nationwide police clearance" },
  { label: "Work history review", sub: "Previous employment and references" },
];

interface Props {
  ninReady: boolean;
}

export default function BackgroundCheckForm({ ninReady }: Props) {
  const [state, formAction, isPending] = useActionState<State | null, FormData>(
    startBackgroundCheckAction,
    null
  );

  if (state?.success) {
    return (
      <div
        className="flex items-start gap-3 rounded-xl px-4 py-3.5"
        style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)" }}
        role="status"
        aria-live="polite"
      >
        <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: "#f59e0b" }} />
        <div>
          <p className="text-sm font-semibold text-amber-900">Background check started</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Our verification partner is processing your check. Estimated time: 2–5 business days.
          </p>
        </div>
      </div>
    );
  }

  if (!ninReady) {
    return (
      <div
        className="flex items-start gap-3 rounded-xl px-4 py-3.5"
        style={{ background: "rgba(0,0,0,0.025)", border: "1px solid rgba(0,0,0,0.07)" }}
      >
        <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: "#a8a29e" }} />
        <p className="text-sm text-stone-400">
          Complete your NIN submission above to unlock the background check.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      {state?.error && (
        <div
          className="rounded-xl px-4 py-3 text-sm text-red-700"
          style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}
          role="alert"
        >
          {state.error}
        </div>
      )}

      {/* What the check covers */}
      <ul className="space-y-2.5" aria-label="Background check covers">
        {CHECK_ITEMS.map((item) => (
          <li key={item.label} className="flex items-start gap-3">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: "rgba(16,185,129,0.1)" }}
            >
              <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" aria-hidden="true">
                <path d="M2 6l2.5 2.5L10 3.5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-medium text-stone-700">{item.label}</p>
              <p className="text-xs text-stone-400">{item.sub}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Consent checkbox */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          name="consent"
          value="true"
          className="mt-0.5 w-4 h-4 rounded accent-amber-600 cursor-pointer"
          required
          aria-required="true"
        />
        <span className="text-xs text-stone-500 leading-relaxed group-hover:text-stone-700 transition-colors">
          I authorise HandyHire and its verification partner to conduct a background check using
          my submitted details and agree to the{" "}
          <span className="font-medium text-amber-700">verification terms</span>.
        </span>
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl
          transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:-translate-y-px"
        style={{
          background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
          boxShadow: "0 2px 8px rgba(180,83,9,0.25)",
        }}
      >
        {isPending && <Spinner />}
        {isPending ? "Starting…" : "Start background check"}
      </button>
    </form>
  );
}
