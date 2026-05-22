"use client";

import { useActionState } from "react";
import { submitNINAction } from "@/lib/worker/verification-actions";
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

export default function NINSubmitForm() {
  const [state, formAction, isPending] = useActionState<State | null, FormData>(
    submitNINAction,
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
          <p className="text-sm font-semibold text-amber-900">NIN submitted successfully</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Your NIN is queued for review. Proceed to start your background check below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-4">
      {state?.error && !state.fieldErrors && (
        <div
          className="rounded-xl px-4 py-3 text-sm text-red-700"
          style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}
          role="alert"
        >
          {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="nin" className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
          National Identity Number (NIN)
        </label>
        <input
          id="nin"
          name="nin"
          type="text"
          inputMode="numeric"
          maxLength={11}
          placeholder="e.g. 12345678901"
          autoComplete="off"
          className="w-full text-sm rounded-xl px-4 py-3 outline-none transition-all duration-150"
          style={{
            background: "#fafaf9",
            border: state?.fieldErrors?.nin
              ? "1px solid #fca5a5"
              : "1px solid rgba(0,0,0,0.1)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            color: "#1c1917",
          }}
          aria-describedby={state?.fieldErrors?.nin ? "nin-error" : undefined}
          aria-invalid={!!state?.fieldErrors?.nin}
        />
        {state?.fieldErrors?.nin && (
          <p id="nin-error" className="text-xs text-red-600 mt-1">
            {state.fieldErrors.nin}
          </p>
        )}
        <p className="text-xs text-stone-400">
          Your NIN is an 11-digit number on your National ID card or NIMC slip.
        </p>
      </div>

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
        {isPending ? "Submitting…" : "Submit NIN"}
      </button>
    </form>
  );
}
