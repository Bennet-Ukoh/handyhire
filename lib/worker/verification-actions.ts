"use server";

import { getSession } from "@/lib/auth/session";
import { submitNINSchema, startBGCheckSchema } from "./schemas";
import {
  getVerification,
  updateNINRecord,
  updateBGCheckRecord,
} from "./verification-store";
import type { ActionState } from "@/lib/auth/types";

type VerificationActionState = ActionState & { success?: boolean };

export async function submitNINAction(
  _prev: VerificationActionState | null,
  formData: FormData
): Promise<VerificationActionState> {
  const session = await getSession();
  if (!session || session.role !== "worker") {
    return { error: "You must be signed in as a worker." };
  }

  const parsed = submitNINSchema.safeParse({ nin: formData.get("nin") });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: parsed.error.issues[0].message, fieldErrors };
  }

  updateNINRecord(session.userId, {
    status: "pending",
    submittedAt: new Date().toISOString(),
    rejectionReason: undefined,
  });

  return { success: true };
}

export async function startBackgroundCheckAction(
  _prev: VerificationActionState | null,
  formData: FormData
): Promise<VerificationActionState> {
  const session = await getSession();
  if (!session || session.role !== "worker") {
    return { error: "You must be signed in as a worker." };
  }

  const verification = getVerification(session.userId);
  const ninStatus = verification.nin.status;
  if (ninStatus === "unverified") {
    return { error: "Submit your NIN before starting a background check." };
  }

  const parsed = startBGCheckSchema.safeParse({ consent: formData.get("consent") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  updateBGCheckRecord(session.userId, {
    status: "pending",
    submittedAt: new Date().toISOString(),
    rejectionReason: undefined,
  });

  return { success: true };
}

/** Dev-only tool — advances pending→in_review→verified for both checks. */
export async function simulateReviewProgressAction(
  _prev: VerificationActionState | null,
  _formData: FormData
): Promise<VerificationActionState> {
  const session = await getSession();
  if (!session || session.role !== "worker") {
    return { error: "Not authorised." };
  }

  const verification = getVerification(session.userId);
  const now = new Date().toISOString();

  function advance(status: string) {
    if (status === "pending") return "in_review";
    if (status === "in_review") return "verified";
    return status;
  }

  const newNinStatus = advance(verification.nin.status);
  const newBgStatus = advance(verification.backgroundCheck.status);

  if (newNinStatus !== verification.nin.status) {
    updateNINRecord(session.userId, {
      status: newNinStatus as "in_review" | "verified",
      reviewedAt: newNinStatus === "verified" ? now : undefined,
    });
  }

  if (newBgStatus !== verification.backgroundCheck.status) {
    updateBGCheckRecord(session.userId, {
      status: newBgStatus as "in_review" | "verified",
      reviewedAt: newBgStatus === "verified" ? now : undefined,
    });
  }

  return { success: true };
}
