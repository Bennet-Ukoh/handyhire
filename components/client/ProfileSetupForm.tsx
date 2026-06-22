"use client";

import { useActionState } from "react";
import { updateClientProfileAction } from "@/lib/client/actions";
import type { ProfileSetupState } from "@/lib/client/actions";

interface Props {
  from?: string;
}

export default function ProfileSetupForm({ from }: Props) {
  const [state, action, pending] = useActionState<ProfileSetupState | null, FormData>(
    updateClientProfileAction,
    null
  );

  return (
    <div
      className="bg-white rounded-2xl p-7 md:p-9"
      style={{ border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}
    >
      {/* Header */}
      <div className="mb-7">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
          style={{ background: "rgba(217,119,6,0.1)" }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-amber-600"
            aria-hidden="true"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h1 className="font-display text-2xl text-stone-900 leading-tight">
          One last step
        </h1>
        <p className="text-sm text-stone-500 mt-1.5 leading-relaxed">
          Tell workers where you are and how to reach you — this lets them quote accurately and get in touch fast.
        </p>
      </div>

      {/* Form */}
      <form action={action} className="space-y-5">
        {from && <input type="hidden" name="from" value={from} />}

        {/* Location */}
        <div className="space-y-1.5">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-stone-700"
          >
            Your location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="e.g. Lagos, Ikeja"
            autoComplete="address-level2"
            required
            className="w-full h-11 px-3.5 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all"
            style={{
              border: state?.fieldErrors?.location
                ? "1.5px solid #ef4444"
                : "1.5px solid rgba(0,0,0,0.12)",
              background: "#fafaf9",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#d97706";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(217,119,6,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = state?.fieldErrors?.location
                ? "#ef4444"
                : "rgba(0,0,0,0.12)";
              e.currentTarget.style.boxShadow = "none";
            }}
            aria-describedby={state?.fieldErrors?.location ? "location-error" : undefined}
          />
          {state?.fieldErrors?.location && (
            <p id="location-error" className="text-xs text-red-600 mt-1">
              {state.fieldErrors.location}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-stone-700"
          >
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+234 800 000 0000"
            autoComplete="tel"
            required
            className="w-full h-11 px-3.5 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all"
            style={{
              border: state?.fieldErrors?.phone
                ? "1.5px solid #ef4444"
                : "1.5px solid rgba(0,0,0,0.12)",
              background: "#fafaf9",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#d97706";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(217,119,6,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = state?.fieldErrors?.phone
                ? "#ef4444"
                : "rgba(0,0,0,0.12)";
              e.currentTarget.style.boxShadow = "none";
            }}
            aria-describedby={state?.fieldErrors?.phone ? "phone-error" : undefined}
          />
          {state?.fieldErrors?.phone && (
            <p id="phone-error" className="text-xs text-red-600 mt-1">
              {state.fieldErrors.phone}
            </p>
          )}
        </div>

        {/* Global error */}
        {state?.error && !state.fieldErrors && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
            {state.error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={pending}
          className="w-full h-11 rounded-xl text-sm font-semibold text-white transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-px"
          style={{
            background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
            boxShadow: "0 4px 14px rgba(180,83,9,0.28)",
          }}
        >
          {pending ? "Saving…" : "Complete profile"}
        </button>
      </form>

      {/* Privacy note */}
      <p className="text-xs text-stone-400 text-center mt-5 leading-relaxed">
        Your contact details are only shared with workers you engage — never publicly visible.
      </p>
    </div>
  );
}
