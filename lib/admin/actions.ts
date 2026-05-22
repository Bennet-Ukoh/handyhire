"use server";

import { getSession } from "@/lib/auth/session";
import { updateNINRecord, updateBGCheckRecord } from "@/lib/worker/verification-store";
import { insertAdminAction } from "./admin-log-store";
import { getWorkerVerificationDetail } from "./service";
import type { ActionState } from "@/lib/auth/types";
import type { AdminCheckAction } from "./types";

type CheckType = "nin" | "backgroundCheck";

function logAction(
  adminId: string,
  adminName: string,
  workerId: string,
  workerName: string,
  action: AdminCheckAction,
  reason?: string
): void {
  insertAdminAction({
    id: `al_${Date.now()}`,
    workerId,
    workerName,
    adminId,
    adminName,
    action,
    reason,
    performedAt: new Date().toISOString(),
  });
}

async function requireAdmin(): Promise<
  { ok: true; adminId: string; adminName: string } | { ok: false; error: string }
> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { ok: false, error: "Admin access required." };
  }
  return { ok: true, adminId: session.userId, adminName: session.name };
}

/**
 * Approve a NIN or background check.
 * Replace body with: POST /api/admin/verifications/:workerId/approve
 */
export async function approveCheckAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  const workerId   = String(formData.get("workerId") ?? "").trim();
  const checkType  = String(formData.get("checkType") ?? "") as CheckType;

  if (!workerId || !["nin", "backgroundCheck"].includes(checkType)) {
    return { error: "Invalid request parameters." };
  }

  const detail = getWorkerVerificationDetail(workerId);
  if (!detail) return { error: "Worker not found." };

  const now = new Date().toISOString();
  if (checkType === "nin") {
    updateNINRecord(workerId, { status: "verified", reviewedAt: now });
    logAction(auth.adminId, auth.adminName, workerId, detail.workerName, "approve_nin");
  } else {
    updateBGCheckRecord(workerId, { status: "verified", reviewedAt: now });
    logAction(auth.adminId, auth.adminName, workerId, detail.workerName, "approve_bgcheck");
  }

  return {};
}

/**
 * Reject a NIN or background check with a reason.
 * Replace body with: POST /api/admin/verifications/:workerId/reject
 */
export async function rejectCheckAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  const workerId   = String(formData.get("workerId") ?? "").trim();
  const checkType  = String(formData.get("checkType") ?? "") as CheckType;
  const reason     = String(formData.get("reason") ?? "").trim();

  if (!workerId || !["nin", "backgroundCheck"].includes(checkType)) {
    return { error: "Invalid request parameters." };
  }
  if (!reason) {
    return { error: "A rejection reason is required." };
  }

  const detail = getWorkerVerificationDetail(workerId);
  if (!detail) return { error: "Worker not found." };

  if (checkType === "nin") {
    updateNINRecord(workerId, { status: "rejected", rejectionReason: reason });
    logAction(auth.adminId, auth.adminName, workerId, detail.workerName, "reject_nin", reason);
  } else {
    updateBGCheckRecord(workerId, { status: "rejected", rejectionReason: reason });
    logAction(auth.adminId, auth.adminName, workerId, detail.workerName, "reject_bgcheck", reason);
  }

  return {};
}

/**
 * Flag a check for manual review with an optional note.
 * Replace body with: POST /api/admin/verifications/:workerId/manual-review
 */
export async function requestManualReviewAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  const workerId  = String(formData.get("workerId") ?? "").trim();
  const checkType = String(formData.get("checkType") ?? "") as CheckType;
  const note      = String(formData.get("note") ?? "").trim() || undefined;

  if (!workerId || !["nin", "backgroundCheck"].includes(checkType)) {
    return { error: "Invalid request parameters." };
  }

  const detail = getWorkerVerificationDetail(workerId);
  if (!detail) return { error: "Worker not found." };

  if (checkType === "nin") {
    updateNINRecord(workerId, { status: "manual_review" });
    logAction(auth.adminId, auth.adminName, workerId, detail.workerName, "manual_review_nin", note);
  } else {
    updateBGCheckRecord(workerId, { status: "manual_review" });
    logAction(auth.adminId, auth.adminName, workerId, detail.workerName, "manual_review_bgcheck", note);
  }

  return {};
}
