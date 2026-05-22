"use client";

import Link from "next/link";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function WorkerDashboardError({ error, reset }: Props) {
  return (
    <div className="min-h-[480px] flex flex-col items-center justify-center text-center px-4 py-16">
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.14)" }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-7 h-7"
          stroke="#ef4444"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>

      {/* Message */}
      <h2 className="text-base font-semibold text-stone-800 mb-1.5">
        Dashboard failed to load
      </h2>
      <p className="text-sm text-stone-500 max-w-xs leading-relaxed mb-6">
        Something went wrong while loading your dashboard. This is usually temporary.
        {error.digest && (
          <span className="block mt-2 text-xs text-stone-400 font-mono">
            Error ID: {error.digest}
          </span>
        )}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl
            transition-all duration-150 hover:-translate-y-px"
          style={{
            background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
            boxShadow: "0 2px 8px rgba(180,83,9,0.22)",
          }}
        >
          <svg
            viewBox="0 0 20 20"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 10a6 6 0 1 1 1.06 3.4M4 14V10H8" />
          </svg>
          Try again
        </button>

        <Link
          href="/"
          className="text-sm font-medium text-stone-500 hover:text-stone-900 px-4 py-2 rounded-xl
            hover:bg-stone-100 transition-colors"
        >
          Go to home
        </Link>
      </div>
    </div>
  );
}
