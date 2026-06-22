import Link from "next/link";

export default function ProfileIncompleteBanner() {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl px-5 py-4"
      style={{
        background: "linear-gradient(135deg, rgba(217,119,6,0.08) 0%, rgba(180,83,9,0.05) 100%)",
        border: "1.5px solid rgba(217,119,6,0.22)",
      }}
      role="status"
      aria-label="Profile setup required"
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
        style={{ background: "rgba(217,119,6,0.12)" }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-amber-700"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>

      {/* Copy */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-stone-900">
          Complete your profile to start posting jobs
        </p>
        <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
          Add your location and phone number so tradespeople can reach you and quote accurately.
        </p>
      </div>

      {/* CTA */}
      <Link
        href="/client/profile/setup"
        className="self-start sm:self-auto shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2.5 rounded-xl transition-all duration-150 hover:-translate-y-px"
        style={{
          background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
          boxShadow: "0 2px 8px rgba(180,83,9,0.25)",
        }}
      >
        Set up profile
        <svg
          viewBox="0 0 16 16"
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </Link>
    </div>
  );
}
