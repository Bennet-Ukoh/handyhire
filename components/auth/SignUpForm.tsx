"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUpAction } from "@/lib/auth/actions";
import type { ActionState, UserRole } from "@/lib/auth/types";
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

interface Props {
  initialRole: "client" | "worker";
}

export default function SignUpForm({ initialRole }: Props) {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    signUpAction,
    null
  );
  const [role, setRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        background: "#FFFFFF",
        borderColor: "rgba(0,0,0,0.07)",
        boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 12px 28px rgba(0,0,0,0.10)",
      }}
    >
      {/* Heading */}
      <div className="mb-4">
        <h1 className="font-display text-[1.6rem] text-stone-900 leading-tight mb-1">
          Create your account
        </h1>
        <p className="text-sm text-stone-500">
          Join thousands of Nigerians on HandyHire
        </p>
      </div>

      {/* Role selector */}
      <div className="grid grid-cols-2 gap-2 mb-4" role="group" aria-label="Account type">
        {(
          [
            {
              value: "client" as const,
              label: "Hire workers",
              sub: "I need work done",
              icon: (
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
                  <path d="M3 7l7-5 7 5v10a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 17V7z" />
                  <polyline points="7.5 18.5 7.5 10 12.5 10 12.5 18.5" />
                </svg>
              ),
            },
            {
              value: "worker" as const,
              label: "Find jobs",
              sub: "I offer services",
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
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors duration-150 ${
                  active ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-500"
                }`}
              >
                {icon}
              </span>
              <span className={`text-sm font-semibold ${active ? "text-stone-900" : "text-stone-600"}`}>
                {label}
              </span>
              <span className={`text-xs ${active ? "text-stone-500" : "text-stone-400"}`}>
                {sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Error banner */}
      {state?.error && (
        <div
          className="flex items-start gap-2.5 rounded-xl px-4 py-3.5 mb-5 text-sm"
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

      {/* Form */}
      <form action={formAction} noValidate className="space-y-4">
        {/* Hidden role field */}
        <input type="hidden" name="role" value={role} />

        {/* Full name */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-medium text-stone-700">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Aisha Bello"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-colors duration-150"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-stone-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-colors duration-150"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-stone-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
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

        {/* Trade — workers only */}
        {role === "worker" && (
          <div className="space-y-1.5">
            <label htmlFor="trade" className="block text-sm font-medium text-stone-700">
              Primary trade{" "}
              <span className="text-stone-400 font-normal">(optional)</span>
            </label>
            <select
              id="trade"
              name="trade"
              defaultValue=""
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-colors duration-150 appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%2378716c' d='M8 10.5L3 5.5h10L8 10.5z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
                backgroundSize: "16px",
              }}
            >
              <option value="" disabled>
                Select your trade
              </option>
              {TRADE_CATEGORIES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full inline-flex items-center justify-center gap-2 font-semibold text-sm text-white py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 mt-2"
          style={{
            background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
            boxShadow: "0 4px 16px rgba(180,83,9,0.28), 0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          {isPending ? (
            <>
              <Spinner />
              Creating account…
            </>
          ) : role === "worker" ? (
            "Join as a worker — it's free"
          ) : (
            "Create account — it's free"
          )}
        </button>

        <p className="text-[11px] text-stone-400 text-center leading-relaxed pt-1">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-stone-600">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-stone-600">
            Privacy Policy
          </Link>
          .
        </p>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-4">
        <div className="flex-1 h-px bg-stone-100" />
        <span className="text-xs text-stone-400">or</span>
        <div className="flex-1 h-px bg-stone-100" />
      </div>

      {/* Sign-in link */}
      <p className="text-sm text-center text-stone-500">
        Already have an account?{" "}
        <Link
          href="/auth/signin"
          className="font-semibold text-amber-700 hover:text-amber-800 transition-colors duration-150"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
