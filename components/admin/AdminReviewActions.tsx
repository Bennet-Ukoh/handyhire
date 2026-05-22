"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  approveCheckAction,
  rejectCheckAction,
  requestManualReviewAction,
} from "@/lib/admin/actions";
import type { ActionState } from "@/lib/auth/types";
import type { VerificationStatus } from "@/lib/worker/types";

interface Props {
  workerId: string;
  checkType: "nin" | "backgroundCheck";
  currentStatus: VerificationStatus;
  label: string;
}

function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function ApproveButton({ workerId, checkType, label }: { workerId: string; checkType: string; label: string }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    approveCheckAction,
    null
  );
  useEffect(() => { if (state && !state.error) router.refresh(); }, [state, router]);

  return (
    <form action={formAction}>
      <input type="hidden" name="workerId" value={workerId} />
      <input type="hidden" name="checkType" value={checkType} />
      {state?.error && (
        <p className="text-xs text-red-600 mb-2">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2 rounded-xl
          transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:-translate-y-px"
        style={{
          background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
          boxShadow: "0 2px 6px rgba(5,150,105,0.3)",
        }}
      >
        {isPending && <Spinner />}
        {isPending ? "Approving…" : `Approve ${label}`}
      </button>
    </form>
  );
}

function RejectForm({ workerId, checkType, label }: { workerId: string; checkType: string; label: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    rejectCheckAction,
    null
  );
  useEffect(() => { if (state && !state.error) { setOpen(false); router.refresh(); } }, [state, router]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl
          transition-all duration-150 hover:bg-red-50"
        style={{ border: "1px solid rgba(239,68,68,0.25)", color: "#dc2626" }}
      >
        Reject {label}
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-3 w-full">
      <input type="hidden" name="workerId" value={workerId} />
      <input type="hidden" name="checkType" value={checkType} />
      {state?.error && (
        <p className="text-xs text-red-600">{state.error}</p>
      )}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
          Rejection reason <span className="text-red-500">*</span>
        </label>
        <textarea
          name="reason"
          rows={3}
          placeholder="Explain why this check is being rejected…"
          className="w-full text-sm rounded-xl px-3 py-2.5 outline-none resize-none transition-all"
          style={{
            background: "#fafaf9",
            border: "1px solid rgba(0,0,0,0.1)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            color: "#1c1917",
          }}
          required
          autoFocus
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2 rounded-xl
            transition-all duration-150 disabled:opacity-60 hover:enabled:-translate-y-px"
          style={{ background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)", boxShadow: "0 2px 6px rgba(220,38,38,0.3)" }}
        >
          {isPending && <Spinner />}
          {isPending ? "Rejecting…" : "Confirm rejection"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-stone-400 hover:text-stone-600 transition-colors px-2 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function ManualReviewForm({ workerId, checkType, label }: { workerId: string; checkType: string; label: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    requestManualReviewAction,
    null
  );
  useEffect(() => { if (state && !state.error) { setOpen(false); router.refresh(); } }, [state, router]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl
          transition-all duration-150 hover:bg-violet-50"
        style={{ border: "1px solid rgba(139,92,246,0.25)", color: "#7c3aed" }}
      >
        Flag for manual review
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-3 w-full">
      <input type="hidden" name="workerId" value={workerId} />
      <input type="hidden" name="checkType" value={checkType} />
      {state?.error && (
        <p className="text-xs text-red-600">{state.error}</p>
      )}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
          Review note (optional)
        </label>
        <textarea
          name="note"
          rows={2}
          placeholder="What needs manual attention?"
          className="w-full text-sm rounded-xl px-3 py-2.5 outline-none resize-none transition-all"
          style={{
            background: "#fafaf9",
            border: "1px solid rgba(0,0,0,0.1)",
            color: "#1c1917",
          }}
          autoFocus
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2 rounded-xl
            transition-all duration-150 disabled:opacity-60 hover:enabled:-translate-y-px"
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", boxShadow: "0 2px 6px rgba(124,58,237,0.3)" }}
        >
          {isPending && <Spinner />}
          {isPending ? "Flagging…" : "Flag for manual review"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-stone-400 hover:text-stone-600 transition-colors px-2 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const ACTIONABLE: VerificationStatus[] = ["pending", "in_review", "manual_review", "rejected"];

export default function AdminReviewActions({ workerId, checkType, currentStatus, label }: Props) {
  if (!ACTIONABLE.includes(currentStatus) || currentStatus === "verified") return null;

  return (
    <div className="space-y-3 pt-2">
      <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Admin action</p>
      <div className="flex flex-wrap items-start gap-3">
        <ApproveButton workerId={workerId} checkType={checkType} label={label} />
        <RejectForm workerId={workerId} checkType={checkType} label={label} />
        {currentStatus !== "manual_review" && (
          <ManualReviewForm workerId={workerId} checkType={checkType} label={label} />
        )}
      </div>
    </div>
  );
}
