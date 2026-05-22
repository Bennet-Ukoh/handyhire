import type { ProfileCompleteness } from "@/lib/worker/types";
import { PROFILE_STEP_LABELS } from "@/lib/worker/types";

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 6l3 3 5-5" />
    </svg>
  );
}

interface Props {
  completeness: ProfileCompleteness;
}

export default function ProfileProgress({ completeness }: Props) {
  const { percentage, completedSteps, pendingSteps } = completeness;
  const isAlmostDone = percentage >= 80;

  return (
    <div
      className="bg-white rounded-2xl p-5"
      style={{
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">
            Profile completeness
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            A complete profile gets{" "}
            <span className="text-stone-600 font-medium">3× more job views</span>
          </p>
        </div>
        <span
          className={`text-xl font-bold tabular-nums shrink-0 ${
            isAlmostDone ? "text-emerald-600" : "text-amber-600"
          }`}
        >
          {percentage}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-2 rounded-full mb-4 overflow-hidden"
        style={{ background: "rgba(0,0,0,0.06)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            background: isAlmostDone
              ? "linear-gradient(90deg, #059669, #10b981)"
              : "linear-gradient(90deg, #d97706, #f59e0b)",
          }}
        />
      </div>

      {/* Completed + pending */}
      <div className="flex flex-wrap gap-2">
        {completedSteps.map((step) => (
          <span
            key={step}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full"
          >
            <CheckIcon />
            {PROFILE_STEP_LABELS[step]}
          </span>
        ))}
        {pendingSteps.map((step) => (
          <button
            key={step}
            type="button"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-full hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-colors duration-150"
          >
            + {PROFILE_STEP_LABELS[step]}
          </button>
        ))}
      </div>
    </div>
  );
}
