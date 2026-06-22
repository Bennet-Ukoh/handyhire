"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUpAction } from "@/lib/auth/actions";
import { lookupNINForSignupAction } from "@/lib/worker/verification-actions";
import type { ActionState, UserRole } from "@/lib/auth/types";
import type { NINActionState } from "@/lib/worker/verification-actions";
import { TRADE_CATEGORIES } from "@/lib/shared/types";

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function getInitials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

function calcAge(dob?: string): string {
  if (!dob) return "—";
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return `${age} yrs`;
}

interface Props {
  initialRole: "client" | "worker";
}

export default function SignUpForm({ initialRole }: Props) {
  const [signUpState, formAction, isPending] = useActionState<ActionState | null, FormData>(signUpAction, null);
  const [ninState, ninAction, isLookingUp] = useActionState<NINActionState | null, FormData>(lookupNINForSignupAction, null);

  const [role, setRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [ninLookupKey, setNinLookupKey] = useState(0); // forces NIN form remount on reset

  // Controlled step-1 fields — needed so artisan can carry values into step-2 submit
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [trade, setTrade] = useState("");
  const [ninValue, setNinValue] = useState("");

  const ninData = ninState?.ninData;

  function handleContinue() {
    setStep(2);
  }

  function handleBack() {
    setStep(1);
    setNinLookupKey((k) => k + 1); // reset NIN lookup state
  }

  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        background: "#FFFFFF",
        borderColor: "rgba(0,0,0,0.07)",
        boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 12px 28px rgba(0,0,0,0.10)",
      }}
    >

      {/* ── Step 1: Basic info ─────────────────────────────────────── */}
      {step === 1 && (
        <>
          <div className="mb-4">
            <h1 className="font-display text-[1.6rem] text-stone-900 leading-tight mb-1">
              Create your account
            </h1>
            <p className="text-sm text-stone-500">Join thousands of Nigerians on HandyHire</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 mb-4" role="group" aria-label="Account type">
            {(
              [
                {
                  value: "client" as const,
                  label: "Client",
                  sub: "I need something done",
                  icon: (
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
                      <path d="M3 7l7-5 7 5v10a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 17V7z" />
                      <polyline points="7.5 18.5 7.5 10 12.5 10 12.5 18.5" />
                    </svg>
                  ),
                },
                {
                  value: "worker" as const,
                  label: "Artisan",
                  sub: "I offer skilled services",
                  icon: (
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
                      <path d="M11.3 4.7a1 1 0 0 0 0 1.4l1.4 1.4a1 1 0 0 0 1.4 0l3-3a5 5 0 0 1-6.5 6.5L5 16.3a1.8 1.8 0 0 1-2.5-2.5l5.7-5.7A5 5 0 0 1 14.7 2l-3 3-.4-.3z" />
                    </svg>
                  ),
                },
              ] as const
            ).map(({ value, label, sub, icon }) => {
              const active = role === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  aria-pressed={active}
                  className={`flex flex-col gap-1 p-3 rounded-xl border-2 text-left transition-all duration-150 ${
                    active
                      ? "border-amber-400 bg-amber-50"
                      : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50"
                  }`}
                >
                  <span className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors duration-150 ${active ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-500"}`}>
                    {icon}
                  </span>
                  <span className={`text-sm font-semibold ${active ? "text-stone-900" : "text-stone-600"}`}>{label}</span>
                  <span className={`text-xs ${active ? "text-stone-500" : "text-stone-400"}`}>{sub}</span>
                </button>
              );
            })}
          </div>

          {/* Signup error banner */}
          {signUpState?.error && (
            <div
              className="flex items-start gap-2.5 rounded-xl px-4 py-3.5 mb-5 text-sm"
              role="alert"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", color: "#b91c1c" }}
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" aria-hidden="true">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.5h1.5v5h-1.5v-5zm0 6h1.5v1.5h-1.5V10.5z" />
              </svg>
              {signUpState.error}
            </div>
          )}

          {/* For clients: fields live inside a real form. For artisans: controlled state, no form wrapper needed here. */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="s1-email" className="block text-sm font-medium text-stone-700">Email address</label>
              <input
                id="s1-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-colors duration-150"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="s1-password" className="block text-sm font-medium text-stone-700">Password</label>
              <div className="relative">
                <input
                  id="s1-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-colors duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors duration-150"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {role === "worker" && (
              <div className="space-y-1.5">
                <label htmlFor="s1-trade" className="block text-sm font-medium text-stone-700">
                  Primary trade <span className="text-stone-400 font-normal">(optional)</span>
                </label>
                <select
                  id="s1-trade"
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-colors duration-150 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%2378716c' d='M8 10.5L3 5.5h10L8 10.5z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    backgroundSize: "16px",
                  }}
                >
                  <option value="">Select your trade</option>
                  {TRADE_CATEGORIES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-6">
            {role === "worker" ? (
              <>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full inline-flex items-center justify-center gap-2 font-semibold text-sm text-white py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-px mt-2"
                  style={{
                    background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                    boxShadow: "0 4px 16px rgba(180,83,9,0.28), 0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  Continue
                  <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </button>
                <p className="text-xs text-stone-400 text-center mt-2">Next: verify your identity with your NIN</p>
              </>
            ) : (
              /* Client — submit directly */
              <form action={formAction}>
                <input type="hidden" name="role" value="client" />
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="password" value={pass} />
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full inline-flex items-center justify-center gap-2 font-semibold text-sm text-white py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 mt-2"
                  style={{
                    background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                    boxShadow: "0 4px 16px rgba(180,83,9,0.28), 0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  {isPending ? <><Spinner /> Creating account…</> : "Create account — it's free"}
                </button>
              </form>
            )}
          </div>

          <p className="text-[11px] text-stone-400 text-center leading-relaxed pt-3">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-stone-600">Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-stone-600">Privacy Policy</Link>.
          </p>

          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-stone-100" />
            <span className="text-xs text-stone-400">or</span>
            <div className="flex-1 h-px bg-stone-100" />
          </div>

          <p className="text-sm text-center text-stone-500">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-semibold text-amber-700 hover:text-amber-800 transition-colors duration-150">Sign in</Link>
          </p>
        </>
      )}

      {/* ── Step 2: NIN verification (artisans only) ──────────────── */}
      {step === 2 && (
        <>
          {/* Back + step progress dots */}
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-stone-700 transition-colors duration-150"
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 3L5 8l5 5" />
              </svg>
              Back
            </button>
            <div className="flex items-center gap-1.5" aria-label="Step 2 of 2">
              <div className="w-8 h-[3px] rounded-full bg-stone-200" />
              <div className="w-8 h-[3px] rounded-full" style={{ background: "#d97706" }} />
            </div>
          </div>

          {/* Section header */}
          <div className="mb-6">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-3.5"
              style={{ background: "rgba(217,119,6,0.08)" }}
            >
              <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="16" height="12" rx="2" />
                <circle cx="7" cy="9.5" r="2" />
                <path d="M11 8.5h4M11 11h3" />
                <path d="M3.5 16c0-1.5 1.6-2.5 3.5-2.5s3.5 1 3.5 2.5" />
              </svg>
            </div>
            <h2 className="font-display text-[1.4rem] text-stone-900 leading-tight mb-1">
              Verify your identity
            </h2>
            <p className="text-sm text-stone-500 leading-relaxed">
              Your 11-digit NIN is checked against the NIMC database. Only you can see this information.
            </p>
          </div>

          {/* NIN lookup form — reset on key change */}
          {!ninData && (
            <form key={ninLookupKey} action={ninAction} className="space-y-5">
              {ninState?.error && (
                <div
                  className="flex items-start gap-2.5 rounded-xl px-4 py-3.5 text-sm"
                  role="alert"
                  style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", color: "#b91c1c" }}
                >
                  <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" aria-hidden="true">
                    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.5h1.5v5h-1.5v-5zm0 6h1.5v1.5h-1.5V10.5z" />
                  </svg>
                  {ninState.error}
                </div>
              )}

              {/* NIN input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="nin" className="text-sm font-medium text-stone-700">
                    National Identity Number (NIN)
                  </label>
                  <span
                    className="text-xs font-mono tabular-nums transition-colors duration-150"
                    style={{ color: ninValue.length === 11 ? "#059669" : "#a8a29e" }}
                    aria-live="polite"
                    aria-label={`${ninValue.length} of 11 digits entered`}
                  >
                    {ninValue.length}/11
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
                    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="#d1cdc8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="16" height="12" rx="2" />
                      <circle cx="7" cy="9.5" r="2" />
                      <path d="M11 8.5h4M11 11h3" />
                    </svg>
                  </div>
                  <input
                    id="nin"
                    name="nin"
                    type="tel"
                    inputMode="numeric"
                    maxLength={11}
                    required
                    placeholder="00000000000"
                    value={ninValue}
                    onChange={(e) => setNinValue(e.target.value.replace(/\D/g, "").slice(0, 11))}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border bg-white text-stone-900 text-base placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-colors duration-150 tracking-[0.18em] font-mono"
                    style={{
                      borderColor: ninValue.length === 11 ? "rgba(16,185,129,0.4)" : "rgba(0,0,0,0.12)",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#d97706"; }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = ninValue.length === 11
                        ? "rgba(16,185,129,0.4)"
                        : "rgba(0,0,0,0.12)";
                    }}
                  />
                </div>

                {/* 11-segment progress bar */}
                <div className="flex gap-[3px]" aria-hidden="true">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-[3px] rounded-full transition-all duration-150"
                      style={{
                        background:
                          i < ninValue.length
                            ? ninValue.length === 11
                              ? "#10b981"
                              : "#d97706"
                            : "rgba(0,0,0,0.07)",
                      }}
                    />
                  ))}
                </div>

                <p className="text-xs text-stone-400 flex items-center gap-1.5">
                  <svg viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                    <rect x="2" y="5.5" width="8" height="5.5" rx="1" />
                    <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" />
                  </svg>
                  Encrypted · Only used to verify your identity
                </p>
              </div>

              <button
                type="submit"
                disabled={isLookingUp || ninValue.length !== 11}
                className="w-full inline-flex items-center justify-center gap-2 font-semibold text-sm text-white py-3.5 rounded-xl transition-all duration-200 hover:enabled:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                  boxShadow:
                    ninValue.length === 11 && !isLookingUp
                      ? "0 4px 16px rgba(180,83,9,0.28), 0 1px 3px rgba(0,0,0,0.1)"
                      : "none",
                }}
              >
                {isLookingUp ? (
                  <>
                    <Spinner />
                    Looking up NIMC record…
                  </>
                ) : (
                  "Look up NIN"
                )}
              </button>
            </form>
          )}

          {/* NIMC identity card — shown after successful lookup */}
          {ninData && (
            <div className="space-y-4">
              {/* Success chip */}
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)" }}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "#10b981" }}
                >
                  <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none" aria-hidden="true">
                    <path d="M1.5 5.5l2 2 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p className="text-xs font-semibold text-emerald-800">Record found in NIMC database</p>
              </div>

              {/* Dark identity card */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, #1c1917 0%, #292524 60%, #1c1917 100%)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.22), 0 1px 0 rgba(255,255,255,0.05) inset",
                }}
              >
                {/* Amber stripe */}
                <div
                  className="h-[3px] w-full"
                  style={{ background: "linear-gradient(90deg, #b45309 0%, #f59e0b 50%, #b45309 100%)" }}
                />

                <div className="p-5 space-y-4">
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-lg font-bold text-white"
                      style={{ background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)" }}
                      aria-hidden="true"
                    >
                      {getInitials(ninData.firstName, ninData.lastName)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-bold text-white leading-snug truncate">
                        {[ninData.firstName, ninData.middleName, ninData.lastName].filter(Boolean).join(" ")}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <svg viewBox="0 0 14 14" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="#34d399" strokeWidth="1.3" strokeLinejoin="round" aria-hidden="true">
                          <path d="M7 1L1.5 3.5v4c0 3 2.5 5.2 5.5 5.8 3-.6 5.5-2.8 5.5-5.8v-4L7 1z" />
                          <path d="M4.5 7l1.5 1.5 3.5-3.5" strokeLinecap="round" />
                        </svg>
                        <span className="text-[11px] font-semibold" style={{ color: "#34d399" }}>NIMC Verified</span>
                      </div>
                    </div>
                  </div>

                  {/* Detail grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        label: "Date of birth",
                        value: ninData.dateOfBirth
                          ? new Date(ninData.dateOfBirth).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
                          : "—",
                      },
                      { label: "Age", value: calcAge(ninData.dateOfBirth) },
                      { label: "Phone", value: ninData.phoneNumber || "—" },
                      { label: "Location", value: ninData.location || "—" },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="rounded-xl px-3 py-2.5"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "#6b6460" }}>
                          {label}
                        </p>
                        <p className="text-sm text-white font-medium truncate">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* NIN row */}
                  <div
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#6b6460" }}>NIN</span>
                    <span className="text-sm font-mono" style={{ color: "#d6d3d1", letterSpacing: "0.15em" }}>
                      {ninData.nin.replace(/(\d{3})(\d{4})(\d{4})/, "$1 $2 $3")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm form */}
              <form action={formAction}>
                <input type="hidden" name="role" value="worker" />
                <input type="hidden" name="name" value={[ninData.firstName, ninData.lastName].filter(Boolean).join(" ")} />
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="password" value={pass} />
                <input type="hidden" name="trade" value={trade} />
                <input type="hidden" name="nin" value={ninData.nin} />
                <input type="hidden" name="ninData" value={JSON.stringify(ninData)} />
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full inline-flex items-center justify-center gap-2 font-semibold text-sm text-white py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    boxShadow: "0 4px 16px rgba(5,150,105,0.28), 0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  {isPending ? <><Spinner />Creating account…</> : "Yes, this is me — create my account"}
                </button>
              </form>

              {signUpState?.error && (
                <div
                  className="flex items-start gap-2.5 rounded-xl px-4 py-3.5 text-sm"
                  role="alert"
                  style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", color: "#b91c1c" }}
                >
                  <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" aria-hidden="true">
                    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.5h1.5v5h-1.5v-5zm0 6h1.5v1.5h-1.5V10.5z" />
                  </svg>
                  {signUpState.error}
                </div>
              )}

              <button
                type="button"
                onClick={handleBack}
                className="w-full text-sm text-stone-400 hover:text-stone-700 py-2.5 transition-colors duration-150"
              >
                That&apos;s not me — enter a different NIN
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
