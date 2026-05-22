/**
 * Admin service — mock implementation.
 *
 * Swap strategy: replace each function body with the equivalent API call.
 * Signatures, return types, and import paths stay identical — UI never changes.
 */

import { findAllByRole } from "@/lib/auth/mock-store";
import { getVerification } from "@/lib/worker/verification-store";
import { deriveOverallStatus } from "@/lib/worker/types";
import { findAllOpenJobs } from "@/lib/client/mock-store";
import { getAdminLog } from "./admin-log-store";
import type { VerificationQueueItem, AdminStats, QueueFilter, AdminActionRecord } from "./types";
import type { OverallVerificationStatus } from "@/lib/worker/types";

function lastActivityAt(item: VerificationQueueItem): string {
  const dates = [
    item.verification.nin.submittedAt,
    item.verification.nin.reviewedAt,
    item.verification.backgroundCheck.submittedAt,
    item.verification.backgroundCheck.reviewedAt,
    item.joinedAt,
  ].filter(Boolean) as string[];
  return dates.sort().at(-1) ?? item.joinedAt;
}

function matchesFilter(overall: OverallVerificationStatus, v: VerificationQueueItem, filter: QueueFilter): boolean {
  if (filter === "all") return true;
  if (filter === "verified") return overall === "verified";
  if (filter === "rejected") return overall === "rejected";
  if (filter === "in_review") {
    return v.verification.nin.status === "in_review" || v.verification.backgroundCheck.status === "in_review";
  }
  if (filter === "manual_review") {
    return v.verification.nin.status === "manual_review" || v.verification.backgroundCheck.status === "manual_review";
  }
  if (filter === "pending") {
    return v.verification.nin.status === "pending" || v.verification.backgroundCheck.status === "pending";
  }
  return true;
}

/**
 * All workers who have submitted at least one check.
 * Replace body with: GET /api/admin/verifications?filter=xxx
 */
export function getVerificationQueue(filter: QueueFilter = "all"): VerificationQueueItem[] {
  const workers = findAllByRole("worker");

  const items: VerificationQueueItem[] = workers
    .map((w) => {
      const verification = getVerification(w.id);
      const overallStatus = deriveOverallStatus(verification);
      const item: VerificationQueueItem = {
        userId: w.id,
        workerName: w.name,
        workerEmail: w.email,
        trade: w.trade,
        location: w.location,
        joinedAt: w.createdAt,
        verification,
        overallStatus,
        lastActivityAt: "",
      };
      item.lastActivityAt = lastActivityAt(item);
      return item;
    })
    // Only show workers who have at least submitted something
    .filter((item) => {
      const { nin, backgroundCheck } = item.verification;
      return nin.status !== "unverified" || backgroundCheck.status !== "unverified";
    })
    .filter((item) => matchesFilter(item.overallStatus, item, filter))
    .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt));

  return items;
}

/**
 * Full detail for a single worker.
 * Replace body with: GET /api/admin/verifications/:workerId
 */
export function getWorkerVerificationDetail(userId: string): VerificationQueueItem | null {
  const worker = findAllByRole("worker").find((w) => w.id === userId);
  if (!worker) return null;

  const verification = getVerification(worker.id);
  const overallStatus = deriveOverallStatus(verification);
  const item: VerificationQueueItem = {
    userId: worker.id,
    workerName: worker.name,
    workerEmail: worker.email,
    trade: worker.trade,
    location: worker.location,
    joinedAt: worker.createdAt,
    verification,
    overallStatus,
    lastActivityAt: "",
  };
  item.lastActivityAt = lastActivityAt(item);
  return item;
}

/**
 * Platform-wide stats for the overview.
 * Replace body with: GET /api/admin/stats
 */
export function getAdminStats(): AdminStats {
  const workers = findAllByRole("worker");
  const clients = findAllByRole("client");
  const openJobs = findAllOpenJobs();

  let pendingVerifications = 0;
  let verifiedWorkers = 0;
  let rejectedWorkers = 0;

  for (const w of workers) {
    const verification = getVerification(w.id);
    const overall = deriveOverallStatus(verification);
    if (overall === "verified") verifiedWorkers++;
    else if (overall === "rejected") rejectedWorkers++;
    else if (overall === "in_progress") pendingVerifications++;
    else if (
      verification.nin.status === "manual_review" ||
      verification.backgroundCheck.status === "manual_review"
    ) {
      pendingVerifications++;
    }
  }

  return {
    totalWorkers: workers.length,
    pendingVerifications,
    verifiedWorkers,
    rejectedWorkers,
    totalClients: clients.length,
    openJobs: openJobs.length,
  };
}

/**
 * Admin audit log for a specific worker (or all if omitted).
 * Replace body with: GET /api/admin/log?workerId=xxx
 */
export function getWorkerAuditLog(workerId?: string): AdminActionRecord[] {
  return getAdminLog(workerId);
}
