/**
 * File-backed mock verification store — SERVER ONLY.
 *
 * Shape: Record<userId, WorkerVerification>
 * Persistence: globalThis.__hhVerifications (HMR-safe) + .mock-verifications.json (restart-safe).
 *
 * Swap strategy: delete this file and replace all imports with API calls.
 */

import fs from "fs";
import path from "path";
import type { WorkerVerification, VerificationRecord, VerificationDocument } from "./types";

declare global {
  // eslint-disable-next-line no-var
  var __hhVerifications: Record<string, WorkerVerification> | undefined;
}

const STORE_PATH = path.join(process.cwd(), ".mock-verifications.json");

const UNVERIFIED_VERIFICATION: WorkerVerification = {
  nin: { status: "unverified" },
  backgroundCheck: { status: "unverified" },
};

const SEED_VERIFICATIONS: Record<string, WorkerVerification> = {
  usr_worker_001: {
    nin: { status: "verified", submittedAt: "2026-05-10T09:00:00Z", reviewedAt: "2026-05-15T14:30:00Z" },
    backgroundCheck: { status: "verified", submittedAt: "2026-05-18T11:00:00Z", reviewedAt: "2026-05-20T09:00:00Z" },
  },
  usr_worker_tunde: {
    nin: { status: "verified", submittedAt: "2026-05-08T10:00:00Z", reviewedAt: "2026-05-12T11:00:00Z" },
    backgroundCheck: { status: "verified", submittedAt: "2026-05-13T09:00:00Z", reviewedAt: "2026-05-16T14:00:00Z" },
  },
  usr_worker_bola: {
    nin: { status: "verified", submittedAt: "2026-05-15T08:00:00Z", reviewedAt: "2026-05-18T10:00:00Z" },
    backgroundCheck: { status: "pending", submittedAt: "2026-05-20T10:00:00Z" },
  },
  usr_worker_chidi: {
    nin: { status: "unverified" },
    backgroundCheck: { status: "unverified" },
  },
  usr_worker_amaka: {
    nin: { status: "in_review", submittedAt: "2026-05-19T15:00:00Z" },
    backgroundCheck: { status: "pending", submittedAt: "2026-05-20T08:00:00Z" },
  },
  usr_worker_bayo: {
    nin: { status: "verified", submittedAt: "2026-04-20T09:00:00Z", reviewedAt: "2026-04-25T11:00:00Z" },
    backgroundCheck: { status: "verified", submittedAt: "2026-04-26T10:00:00Z", reviewedAt: "2026-04-28T15:00:00Z" },
  },
};

function loadFromFile(): Record<string, WorkerVerification> {
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Record<string, WorkerVerification>;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed) && Object.keys(parsed).length > 0) {
      return parsed;
    }
  } catch {
    // File missing or malformed — fall through to seed
  }
  return { ...SEED_VERIFICATIONS };
}

function getStore(): Record<string, WorkerVerification> {
  if (!global.__hhVerifications) {
    global.__hhVerifications = loadFromFile();
  }
  return global.__hhVerifications;
}

function persistToFile(store: Record<string, WorkerVerification>): void {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch {
    // Non-fatal in dev
  }
}

/**
 * Get the current verification record for a worker.
 * Replace body with: GET /api/workers/:userId/verification
 */
export function getVerification(userId: string): WorkerVerification {
  const store = getStore();
  return store[userId] ?? { ...UNVERIFIED_VERIFICATION };
}

/**
 * Update NIN fields for a worker.
 * Replace body with: PATCH /api/workers/:userId/verification/nin
 */
export function updateNINRecord(
  userId: string,
  patch: Partial<VerificationRecord>
): void {
  const store = getStore();
  const current = store[userId] ?? { ...UNVERIFIED_VERIFICATION };
  store[userId] = {
    ...current,
    nin: { ...current.nin, ...patch },
  };
  persistToFile(store);
}

/**
 * Update background check fields for a worker.
 * Replace body with: PATCH /api/workers/:userId/verification/background-check
 */
export function updateBGCheckRecord(
  userId: string,
  patch: Partial<VerificationRecord>
): void {
  const store = getStore();
  const current = store[userId] ?? { ...UNVERIFIED_VERIFICATION };
  store[userId] = {
    ...current,
    backgroundCheck: { ...current.backgroundCheck, ...patch },
  };
  persistToFile(store);
}

/**
 * Append supporting documents to a worker's verification record.
 * Replace body with: POST /api/workers/:userId/verification/documents
 */
export function addDocuments(
  userId: string,
  docs: VerificationDocument[]
): void {
  const store = getStore();
  const current = store[userId] ?? { ...UNVERIFIED_VERIFICATION };
  store[userId] = {
    ...current,
    documents: [...(current.documents ?? []), ...docs],
  };
  persistToFile(store);
}
