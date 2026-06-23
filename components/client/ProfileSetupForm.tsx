"use client";

import { useActionState, useState } from "react";
import { updateClientProfileAction } from "@/lib/client/actions";
import type { ProfileSetupState } from "@/lib/client/actions";

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="block text-sm font-medium text-stone-700">
          {label}
        </label>
        {hint && <span className="text-xs text-stone-400">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <svg viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="currentColor" aria-hidden="true">
            <path d="M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1zm-.5 2.5h1v3.5h-1V3.5zm0 4.5h1v1h-1V8z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function InputBase({
  hasError,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  const [focused, setFocused] = useState(false);

  return (
    <input
      {...props}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
      className="w-full px-4 py-3 rounded-xl border text-stone-900 text-sm placeholder:text-stone-400 bg-stone-50 focus:bg-white outline-none transition-all duration-150"
      style={{
        borderColor: hasError
          ? "#ef4444"
          : focused
          ? "#d97706"
          : "rgba(0,0,0,0.1)",
        boxShadow: focused
          ? hasError
            ? "0 0 0 3px rgba(239,68,68,0.1)"
            : "0 0 0 3px rgba(217,119,6,0.1)"
          : "none",
      }}
    />
  );
}

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
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "#FFFFFF",
        borderColor: "rgba(0,0,0,0.07)",
        boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 12px 28px rgba(0,0,0,0.10)",
      }}
    >
      {/* Amber accent stripe */}
      <div
        className="h-1 w-full"
        style={{ background: "linear-gradient(90deg, #d97706 0%, #f59e0b 60%, #d97706 100%)" }}
      />

      <div className="p-7 md:p-9">
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

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5" aria-label="Step 2 of 2">
              <div
                className="w-6 h-[3px] rounded-full"
                style={{ background: "#d97706" }}
              />
              <div
                className="w-6 h-[3px] rounded-full"
                style={{ background: "#d97706" }}
              />
            </div>
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Step 2 of 2
            </span>
          </div>

          <h1 className="font-display text-[1.6rem] text-stone-900 leading-tight mb-1.5">
            Complete your profile
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            Help tradespeople find you and quote accurately. Takes 30 seconds.
          </p>
        </div>

        {/* Form */}
        <form action={action} className="space-y-5">
          {from && <input type="hidden" name="from" value={from} />}

          {/* Full name */}
          <Field
            id="fullName"
            label="Full name"
            hint="Optional"
            error={state?.fieldErrors?.fullName}
          >
            <InputBase
              id="fullName"
              name="fullName"
              type="text"
              placeholder="e.g. Aisha Bello"
              autoComplete="name"
              hasError={!!state?.fieldErrors?.fullName}
              aria-describedby={state?.fieldErrors?.fullName ? "fullName-error" : undefined}
            />
          </Field>

          {/* Location */}
          <Field
            id="location"
            label="Your location"
            error={state?.fieldErrors?.location}
          >
            <InputBase
              id="location"
              name="location"
              type="text"
              placeholder="e.g. Lagos, Ikeja"
              autoComplete="address-level2"
              required
              hasError={!!state?.fieldErrors?.location}
              aria-describedby={state?.fieldErrors?.location ? "location-error" : undefined}
            />
          </Field>

          {/* Phone */}
          <Field
            id="phone"
            label="Phone number"
            error={state?.fieldErrors?.phone}
          >
            <InputBase
              id="phone"
              name="phone"
              type="tel"
              placeholder="+234 800 000 0000"
              autoComplete="tel"
              required
              hasError={!!state?.fieldErrors?.phone}
              aria-describedby={state?.fieldErrors?.phone ? "phone-error" : undefined}
            />
          </Field>

          {/* Global error */}
          {state?.error && !state.fieldErrors && (
            <div
              className="flex items-start gap-2.5 rounded-xl px-4 py-3.5 text-sm"
              role="alert"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", color: "#b91c1c" }}
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" aria-hidden="true">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.5h1.5v5h-1.5v-5zm0 6h1.5v1.5h-1.5V10.5z" />
              </svg>
              {state.error}
            </div>
          )}

          {/* Submit */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={pending}
              className="w-full inline-flex items-center justify-center gap-2 font-semibold text-sm text-white py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              style={{
                background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                boxShadow: "0 4px 16px rgba(180,83,9,0.28), 0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              {pending ? (
                <>
                  <Spinner />
                  Saving…
                </>
              ) : (
                <>
                  Go to my dashboard
                  <svg
                    viewBox="0 0 16 16"
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Trust note */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-stone-400">
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <rect x="2" y="5.5" width="8" height="5.5" rx="1" />
              <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" />
            </svg>
            Private — only shared with workers you hire
          </span>
        </div>
      </div>
    </div>
  );
}
