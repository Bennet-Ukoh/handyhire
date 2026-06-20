"use server";

import { getSession } from "@/lib/auth/session";
import { submitNINSchema, startBGCheckSchema } from "./schemas";
import {
  getVerification,
  updateNINRecord,
  updateBGCheckRecord,
  addDocuments,
} from "./verification-store";
import { lookupNIN } from "./nin-service";
import type { ActionState } from "@/lib/auth/types";
import type { NINLookupData, VerificationDocument, DocumentType } from "./types";

export type NINActionState = ActionState & {
  success?: boolean;
  ninData?: NINLookupData;
};

export type DocumentActionState = ActionState & { success?: boolean };

/* ── Pre-signup NIN lookup (no auth required) ───────────────────────── */

export async function lookupNINForSignupAction(
  _prev: NINActionState | null,
  formData: FormData
): Promise<NINActionState> {
  const parsed = submitNINSchema.safeParse({ nin: formData.get("nin") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const ninData = await lookupNIN(parsed.data.nin);
  if (!ninData) {
    return { error: "NIN not found in the NIMC database. Please check the number and try again." };
  }
  return { ninData };
}

/* ── Step 1: Look up NIN (no store write) ───────────────────────────── */

/**
 * Validate the NIN format and call the NIN lookup service.
 * Does NOT write to the verification store — worker must confirm first.
 *
 * Replace lookup with: GET /api/nimc/verify?nin=xxx
 */
export async function lookupNINAction(
  _prev: NINActionState | null,
  formData: FormData
): Promise<NINActionState> {
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

  const ninData = await lookupNIN(parsed.data.nin);
  if (!ninData) {
    return { error: "NIN not found in the NIMC database. Please check the number and try again." };
  }

  return { ninData };
}

/* ── Step 2: Confirm NIN identity ───────────────────────────────────── */

/**
 * Worker confirms the returned NIN data belongs to them.
 * Stores the NIN data and sets status to "pending" for admin review.
 *
 * Replace with: POST /api/workers/:userId/verification/nin/confirm { nin }
 */
export async function confirmNINAction(
  _prev: NINActionState | null,
  formData: FormData
): Promise<NINActionState> {
  const session = await getSession();
  if (!session || session.role !== "worker") {
    return { error: "You must be signed in as a worker." };
  }

  const parsed = submitNINSchema.safeParse({ nin: formData.get("nin") });
  if (!parsed.success) {
    return { error: "Invalid NIN. Please go back and re-enter your NIN." };
  }

  // Re-fetch to store definitively — avoids passing large data through hidden fields
  const ninData = await lookupNIN(parsed.data.nin);
  if (!ninData) {
    return { error: "Could not verify NIN. Please try again." };
  }

  const now = new Date().toISOString();
  updateNINRecord(session.userId, {
    status: "pending",
    submittedAt: now,
    ninLookupData: ninData,
    ninConfirmedAt: now,
    rejectionReason: undefined,
  });

  return { success: true };
}

/* ── Background check ───────────────────────────────────────────────── */

export async function startBackgroundCheckAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState & { success?: boolean }> {
  const session = await getSession();
  if (!session || session.role !== "worker") {
    return { error: "You must be signed in as a worker." };
  }

  const verification = getVerification(session.userId);
  const ninStatus = verification.nin.status;
  if (ninStatus === "unverified") {
    return { error: "Submit and confirm your NIN before starting a background check." };
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

/* ── Supporting documents ────────────────────────────────────────────── */

function parseDocList(
  json: string | null,
  type: DocumentType,
  baseLabel: string
): VerificationDocument[] {
  if (!json || typeof json !== "string") return [];
  try {
    const urls = JSON.parse(json) as string[];
    const now = new Date().toISOString();
    return urls
      .filter((u) => typeof u === "string" && u.startsWith("data:"))
      .map((dataUrl, i) => ({
        id: `doc_${Date.now()}_${type}_${i}`,
        type,
        label: `${baseLabel}${urls.length > 1 ? ` (${i + 1})` : ""}`,
        dataUrl,
        uploadedAt: now,
      }));
  } catch {
    return [];
  }
}

/**
 * Upload optional supporting documents for verification.
 * Replace body with: POST /api/workers/:userId/verification/documents
 */
export async function uploadDocumentAction(
  _prev: DocumentActionState | null,
  formData: FormData
): Promise<DocumentActionState> {
  const session = await getSession();
  if (!session || session.role !== "worker") {
    return { error: "You must be signed in as a worker." };
  }

  const docs: VerificationDocument[] = [
    ...parseDocList(formData.get("tradeTestDocs") as string | null, "trade_test", "Trade Test Certificate"),
    ...parseDocList(formData.get("workPhotoDocs") as string | null, "work_photo", "Work Photo"),
    ...parseDocList(formData.get("otherDocs") as string | null, "other", "Supporting Document"),
  ];

  if (docs.length === 0) {
    return { error: "Please select at least one document before uploading." };
  }

  addDocuments(session.userId, docs);
  return { success: true };
}
