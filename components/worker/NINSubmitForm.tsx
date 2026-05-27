"use client";

import { useActionState, useState, useEffect } from "react";
import { lookupNINAction, confirmNINAction } from "@/lib/worker/verification-actions";
import type { NINActionState } from "@/lib/worker/verification-actions";
import type { NINLookupData } from "@/lib/worker/types";

/* ── Shared helpers ─────────────────────────────────────────────────── */

function Spinner({ size = "sm" }: { size?: "sm" | "md" }) {
  const cls = size === "md" ? "w-5 h-5" : "w-4 h-4";
  return (
    <svg className={`${cls} animate-spin`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm"
      role="alert"
      style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", color: "#b91c1c" }}
    >
      <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" aria-hidden="true">
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.5h1.5v5h-1.5v-5zm0 6h1.5v1.5h-1.5V10.5z" />
      </svg>
      {message}
    </div>
  );
}

/* ── Step 1: NIN input ──────────────────────────────────────────────── */

function NINInputStep({
  state,
  formAction,
  isPending,
}: {
  state: NINActionState | null;
  formAction: (formData: FormData) => void;
  isPending: boolean;
}) {
  return (
    <form action={formAction} noValidate className="space-y-4">
      {state?.error && !state.fieldErrors && <ErrorBanner message={state.error} />}

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
          disabled={isPending}
          className="w-full text-sm rounded-xl px-4 py-3 outline-none transition-all duration-150 disabled:opacity-60"
          style={{
            background: "#fafaf9",
            border: state?.fieldErrors?.nin ? "1px solid #fca5a5" : "1px solid rgba(0,0,0,0.1)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            color: "#1c1917",
          }}
          aria-describedby={state?.fieldErrors?.nin ? "nin-error" : "nin-hint"}
          aria-invalid={!!state?.fieldErrors?.nin}
        />
        {state?.fieldErrors?.nin ? (
          <p id="nin-error" className="text-xs text-red-600 mt-1">{state.fieldErrors.nin}</p>
        ) : (
          <p id="nin-hint" className="text-xs text-stone-400">
            Your 11-digit NIN is on your National ID card or NIMC slip.
          </p>
        )}
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
        {isPending ? "Verifying NIN…" : "Verify my NIN"}
      </button>
    </form>
  );
}

/* ── Step 2: Looking up ─────────────────────────────────────────────── */

function LookingUpState() {
  return (
    <div className="flex flex-col items-center gap-4 py-6" role="status" aria-live="polite">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.18)" }}
      >
        <Spinner size="md" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-stone-800">Verifying your NIN…</p>
        <p className="text-xs text-stone-400 mt-0.5">Checking with NIMC records. This may take a moment.</p>
      </div>
    </div>
  );
}

/* ── Step 3: Profile preview & confirm ──────────────────────────────── */

function ProfileCard({ data }: { data: NINLookupData }) {
  const fullName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(" ");
  const dob = data.dateOfBirth
    ? new Date(data.dateOfBirth).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })
    : null;
  const genderLabel = data.gender === "M" ? "Male" : data.gender === "F" ? "Female" : null;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      {/* NIN header strip */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #1c1917 0%, #292524 100%)" }}
      >
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 20 20" className="w-4 h-4 text-amber-400" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 3a3 3 0 100 6 3 3 0 000-6zm-7 9a7 7 0 0112.75-4.06A5.98 5.98 0 0110 17a5.98 5.98 0 01-4.25-1.75A6.97 6.97 0 013 14z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-widest text-stone-300">
            NIMC Identity Record
          </span>
        </div>
        <span className="text-xs font-mono text-stone-400">
          {data.nin.replace(/(\d{3})(\d{4})(\d{4})/, "$1 $2 $3")}
        </span>
      </div>

      {/* Profile body */}
      <div className="bg-white px-5 py-5 flex items-start gap-5">
        {/* Avatar */}
        <div className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.photoUrl}
            alt={`Profile photo for ${fullName}`}
            className="w-20 h-20 rounded-2xl object-cover"
            style={{ border: "3px solid rgba(0,0,0,0.06)" }}
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-0.5">Full Name</p>
            <p className="text-base font-bold text-stone-900 leading-tight">{fullName}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-0.5">Phone</p>
              <p className="text-sm font-semibold text-stone-700">{data.phoneNumber}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-0.5">Location</p>
              <p className="text-sm font-semibold text-stone-700">{data.location}</p>
            </div>
            {dob && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-0.5">Date of Birth</p>
                <p className="text-sm font-semibold text-stone-700">{dob}</p>
              </div>
            )}
            {genderLabel && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-0.5">Gender</p>
                <p className="text-sm font-semibold text-stone-700">{genderLabel}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmStep({
  ninData,
  confirmFormAction,
  isConfirming,
  confirmError,
  onDecline,
}: {
  ninData: NINLookupData;
  confirmFormAction: (formData: FormData) => void;
  isConfirming: boolean;
  confirmError?: string;
  onDecline: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* Instruction */}
      <div
        className="flex items-start gap-3 rounded-xl px-4 py-3.5"
        style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.25)" }}
      >
        <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" fill="currentColor" aria-hidden="true">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.5h1.5v5h-1.5v-5zm0 6h1.5v1.5h-1.5V10.5z" />
        </svg>
        <p className="text-xs text-amber-800 leading-relaxed">
          We found a matching identity record. Please review the information below and confirm whether it belongs to you.
        </p>
      </div>

      {/* Profile preview */}
      <ProfileCard data={ninData} />

      {confirmError && <ErrorBanner message={confirmError} />}

      {/* Confirm / Decline actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <form action={confirmFormAction} className="flex-1">
          <input type="hidden" name="nin" value={ninData.nin} />
          <button
            type="submit"
            disabled={isConfirming}
            className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-white
              px-5 py-3 rounded-xl transition-all duration-150
              disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:-translate-y-px"
            style={{
              background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              boxShadow: "0 2px 8px rgba(5,150,105,0.3)",
            }}
          >
            {isConfirming && <Spinner />}
            {isConfirming ? "Submitting…" : "Yes, this is me"}
          </button>
        </form>

        <button
          type="button"
          disabled={isConfirming}
          onClick={onDecline}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 text-sm font-semibold
            text-stone-600 px-5 py-3 rounded-xl transition-all duration-150
            disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:bg-stone-100"
          style={{ border: "1px solid rgba(0,0,0,0.12)" }}
        >
          This is not me
        </button>
      </div>
    </div>
  );
}

/* ── Step 4a: Pending (success) ─────────────────────────────────────── */

function PendingState() {
  return (
    <div
      className="flex items-start gap-3 rounded-xl px-4 py-4"
      style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.18)" }}
      role="status"
      aria-live="polite"
    >
      <span className="w-2 h-2 rounded-full shrink-0 mt-1.5 animate-pulse" style={{ background: "#3b82f6" }} />
      <div>
        <p className="text-sm font-semibold text-blue-900">NIN submitted — pending admin review</p>
        <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
          Your identity details have been sent to our compliance team. You'll be notified within <strong>1–3 business days</strong>.
        </p>
      </div>
    </div>
  );
}

/* ── Step 4b: Declined ──────────────────────────────────────────────── */

function DeclinedState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="space-y-4">
      <div
        className="rounded-xl px-4 py-4 space-y-1.5"
        style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}
        role="alert"
      >
        <p className="text-sm font-semibold text-red-800">NIN data does not match</p>
        <p className="text-xs text-red-600 leading-relaxed">
          The record returned does not appear to belong to you. This could be a data entry error,
          or your NIN may need to be updated at a NIMC registration centre.
        </p>
        <p className="text-xs text-red-500 mt-1">
          For assistance, contact{" "}
          <span className="font-semibold">support@handyhire.ng</span> or visit your nearest NIMC office.
        </p>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700
          px-4 py-2.5 rounded-xl transition-all duration-150 hover:bg-stone-100"
        style={{ border: "1px solid rgba(0,0,0,0.12)" }}
      >
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M1 4v5h5M15 12V7h-5" />
          <path d="M13.5 7A6 6 0 0 0 3 5.5M2.5 9A6 6 0 0 0 13 10.5" />
        </svg>
        Try a different NIN
      </button>
    </div>
  );
}

/* ── Root component ─────────────────────────────────────────────────── */

type Step = "input" | "looking_up" | "confirm" | "confirming" | "pending" | "declined";

export default function NINSubmitForm() {
  const [step, setStep] = useState<Step>("input");

  const [lookupState, lookupFormAction, isLookingUp] = useActionState<NINActionState | null, FormData>(
    lookupNINAction,
    null
  );

  const [confirmState, confirmFormAction, isConfirming] = useActionState<NINActionState | null, FormData>(
    confirmNINAction,
    null
  );

  // Advance to confirm when lookup returns ninData
  useEffect(() => {
    if (lookupState?.ninData) setStep("confirm");
  }, [lookupState?.ninData]);

  // Advance to pending when confirmation succeeds
  useEffect(() => {
    if (confirmState?.success) setStep("pending");
  }, [confirmState?.success]);

  // Track loading states
  useEffect(() => {
    if (isLookingUp) setStep("looking_up");
  }, [isLookingUp]);

  if (step === "pending") return <PendingState />;

  if (step === "declined") {
    return <DeclinedState onRetry={() => setStep("input")} />;
  }

  if (step === "looking_up") {
    return <LookingUpState />;
  }

  if ((step === "confirm" || step === "confirming") && lookupState?.ninData) {
    return (
      <ConfirmStep
        ninData={lookupState.ninData}
        confirmFormAction={confirmFormAction}
        isConfirming={isConfirming}
        confirmError={confirmState?.error}
        onDecline={() => setStep("declined")}
      />
    );
  }

  // Default: input step (includes error feedback from failed lookup)
  return (
    <NINInputStep
      state={lookupState}
      formAction={lookupFormAction}
      isPending={isLookingUp && step === "input"}
    />
  );
}
