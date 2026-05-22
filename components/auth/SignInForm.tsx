"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signInAction } from "@/lib/auth/actions";
import type { ActionState } from "@/lib/auth/types";

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

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

interface Props {
  registered?: boolean;
}

export default function SignInForm({ registered }: Props) {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    signInAction,
    null
  );
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
      <div className="mb-5">
        <h1 className="font-display text-[1.6rem] text-stone-900 leading-tight mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-stone-500">
          Sign in to your HandyHire account
        </p>
      </div>

      {/* Registration success banner */}
      {registered && !state?.error && (
        <div
          className="flex items-start gap-2.5 rounded-xl px-4 py-3.5 mb-5 text-sm"
          role="status"
          style={{
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.22)",
            color: "#065f46",
          }}
        >
          <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" aria-hidden="true">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm3.25 5.25-4 4a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l1.47 1.47 3.47-3.47a.75.75 0 1 1 1.06 1.06z" />
          </svg>
          Account created! Sign in below to continue.
        </div>
      )}

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
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-stone-700">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-amber-700 hover:text-amber-800 transition-colors duration-150"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
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

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full inline-flex items-center justify-center gap-2 font-semibold text-sm text-white py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          style={{
            background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
            boxShadow: "0 4px 16px rgba(180,83,9,0.28), 0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          {isPending ? (
            <>
              <Spinner />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-4">
        <div className="flex-1 h-px bg-stone-100" />
        <span className="text-xs text-stone-400">or</span>
        <div className="flex-1 h-px bg-stone-100" />
      </div>

      {/* Sign-up link */}
      <p className="text-sm text-center text-stone-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="font-semibold text-amber-700 hover:text-amber-800 transition-colors duration-150"
        >
          Create one free
        </Link>
      </p>

      {/* Test credentials — dev only */}
      <div
        className="mt-4 rounded-lg px-3 py-2 text-[11px] flex flex-wrap gap-x-4 gap-y-0.5"
        style={{
          background: "rgba(0,0,0,0.025)",
          border: "1px solid rgba(0,0,0,0.06)",
          color: "#78716c",
        }}
      >
        <span className="font-semibold text-stone-500 w-full mb-0.5">Test accounts · password: password</span>
        <span>client@test.com</span>
        <span>worker@test.com</span>
        <span>admin@test.com</span>
      </div>
    </div>
  );
}
