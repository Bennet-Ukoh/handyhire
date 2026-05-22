"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { simulateReviewProgressAction } from "@/lib/worker/verification-actions";
import type { ActionState } from "@/lib/auth/types";

type State = ActionState & { success?: boolean };

function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

export default function SimulateReviewButton() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<State | null, FormData>(
    simulateReviewProgressAction,
    null
  );

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl
          text-indigo-700 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
          hover:enabled:bg-indigo-50"
        style={{ border: "1px solid rgba(99,102,241,0.25)" }}
      >
        {isPending && <Spinner />}
        {isPending ? "Advancing…" : "Simulate review progress"}
      </button>
    </form>
  );
}
