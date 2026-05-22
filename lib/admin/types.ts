/**
 * Admin domain types.
 *
 * All admin UI and service code imports from here.
 * Update types first when backend contracts change.
 */

import type { WorkerVerification, OverallVerificationStatus } from "@/lib/worker/types";

/* ── Verification queue ─────────────────────────────────────────────── */

export interface VerificationQueueItem {
  userId: string;
  workerName: string;
  workerEmail: string;
  trade?: string;
  location?: string;
  joinedAt: string;       // ISO — when the worker account was created
  verification: WorkerVerification;
  overallStatus: OverallVerificationStatus;
  lastActivityAt: string; // ISO — most recent submission or status change
}

/* ── Audit log ──────────────────────────────────────────────────────── */

export type AdminCheckAction =
  | "approve_nin"
  | "reject_nin"
  | "manual_review_nin"
  | "approve_bgcheck"
  | "reject_bgcheck"
  | "manual_review_bgcheck";

export interface AdminActionRecord {
  id: string;
  workerId: string;
  workerName: string;
  adminId: string;
  adminName: string;
  action: AdminCheckAction;
  reason?: string;         // required for reject, optional for manual_review
  performedAt: string;     // ISO
}

/* ── Platform stats ─────────────────────────────────────────────────── */

export interface AdminStats {
  totalWorkers: number;
  pendingVerifications: number; // workers with ≥1 check in pending/in_review/manual_review
  verifiedWorkers: number;
  rejectedWorkers: number;
  totalClients: number;
  openJobs: number;
}

/* ── Queue filter ───────────────────────────────────────────────────── */

export type QueueFilter =
  | "all"
  | "pending"
  | "in_review"
  | "manual_review"
  | "verified"
  | "rejected";
