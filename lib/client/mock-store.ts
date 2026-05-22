/**
 * File-backed mock job store — SERVER ONLY.
 *
 * Persistence strategy:
 *   1. globalThis.__hhJobs — survives Next.js HMR module re-evaluations.
 *   2. .mock-jobs.json    — survives dev-server restarts.
 *
 * Swap strategy: delete this file and replace imports in service.ts
 * with real API calls. Nothing else changes.
 */

import fs from "fs";
import path from "path";
import type { ClientJob, JobStatus } from "./types";

export interface StoredJob extends ClientJob {
  clientId: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __hhJobs: StoredJob[] | undefined;
}

const STORE_PATH = path.join(process.cwd(), ".mock-jobs.json");

const SEED_JOBS: StoredJob[] = [
  {
    id: "cj_001",
    clientId: "usr_client_001",
    title: "Complete bathroom retiling and plumbing fix",
    description: "The bathroom tiles are cracked and two pipes have been leaking for a week. Need full retiling of floor and wall plus the plumbing sorted.",
    category: "Plumbing",
    status: "open",
    budgetMinNgn: 45_000,
    budgetMaxNgn: 75_000,
    location: "Surulere, Lagos",
    urgency: "normal",
    postedAt: "2026-05-18T09:00:00Z",
    quotesCount: 3,
    photoUrls: [],
  },
  {
    id: "cj_002",
    clientId: "usr_client_001",
    title: "Air conditioner installation — 2 units",
    description: "Need two split AC units installed in the master bedroom and living room. Units already purchased.",
    category: "Electrical",
    status: "in_progress",
    budgetMinNgn: 35_000,
    budgetMaxNgn: 35_000,
    location: "Surulere, Lagos",
    urgency: "normal",
    postedAt: "2026-05-15T14:00:00Z",
    quotesCount: 5,
    photoUrls: [],
    hiredWorkerName: "Emeka Okonkwo",
    hiredWorkerId: "usr_worker_001",
  },
  {
    id: "cj_003",
    clientId: "usr_client_001",
    title: "Whole-house electrical wiring inspection",
    description: "Old wiring in a 4-bedroom flat needs a full safety inspection and report before selling.",
    category: "Electrical",
    status: "completed",
    budgetMinNgn: 18_000,
    budgetMaxNgn: 18_000,
    location: "Surulere, Lagos",
    urgency: "normal",
    postedAt: "2026-04-20T10:00:00Z",
    quotesCount: 4,
    photoUrls: [],
    hiredWorkerName: "Bayo Rasheed",
    hiredWorkerId: "usr_worker_bayo",
    completedAt: "2026-04-28T16:00:00Z",
  },
  {
    id: "cj_004",
    clientId: "usr_client_001",
    title: "Custom wardrobe installation — master bedroom",
    description: "Need a built-in wardrobe fitted along the back wall of the master bedroom. Space is 3m wide by 2.4m tall. Designs already prepared.",
    category: "Carpentry",
    status: "open",
    budgetMinNgn: 80_000,
    budgetMaxNgn: 120_000,
    location: "Surulere, Lagos",
    urgency: "normal",
    postedAt: "2026-05-20T11:00:00Z",
    quotesCount: 0,
    photoUrls: [],
  },
  {
    id: "cj_005",
    clientId: "usr_client_001",
    title: "Office rewiring — 6 workstations",
    description: "Small office needs additional sockets and network points added for 6 desks. Currently only has 4 single sockets in the whole room.",
    category: "Electrical",
    status: "open",
    budgetMinNgn: 25_000,
    budgetMaxNgn: 40_000,
    location: "Victoria Island, Lagos",
    urgency: "normal",
    postedAt: "2026-05-21T09:30:00Z",
    quotesCount: 1,
    photoUrls: [],
  },
  {
    id: "cj_006",
    clientId: "usr_client_001",
    title: "Urgent: burst pipe in ceiling — water leaking into bedroom",
    description: "A pipe in the ceiling has burst and water is dripping through the plasterboard into the master bedroom. Need someone today.",
    category: "Plumbing",
    status: "open",
    budgetMinNgn: 15_000,
    budgetMaxNgn: 30_000,
    location: "Surulere, Lagos",
    urgency: "urgent",
    postedAt: "2026-05-22T07:00:00Z",
    quotesCount: 2,
    photoUrls: [],
  },
];

function loadFromFile(): StoredJob[] {
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as StoredJob[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // File missing or malformed — fall through to seed
  }
  return [...SEED_JOBS];
}

function getJobs(): StoredJob[] {
  if (!global.__hhJobs) {
    global.__hhJobs = loadFromFile();
  }
  return global.__hhJobs;
}

function persistToFile(jobs: StoredJob[]): void {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(jobs, null, 2), "utf-8");
  } catch {
    // Non-fatal in dev
  }
}

export function findJobsByClientId(clientId: string): StoredJob[] {
  return getJobs().filter((j) => j.clientId === clientId);
}

export function findAllOpenJobs(): StoredJob[] {
  return getJobs().filter((j) => j.status === "open");
}

export function findJobById(id: string): StoredJob | undefined {
  return getJobs().find((j) => j.id === id);
}

export function insertJob(job: StoredJob): void {
  const jobs = getJobs();
  jobs.unshift(job);
  persistToFile(jobs);
}

export function updateJobStatus(
  jobId: string,
  status: JobStatus,
  extra?: Partial<StoredJob>
): void {
  const jobs = getJobs();
  const idx = jobs.findIndex((j) => j.id === jobId);
  if (idx !== -1) {
    jobs[idx] = { ...jobs[idx], status, ...extra };
    persistToFile(jobs);
  }
}

export function findJobsByHiredWorkerId(workerId: string): StoredJob[] {
  return getJobs().filter(
    (j) => j.hiredWorkerId === workerId && j.status === "completed"
  );
}

export function incrementQuoteCount(jobId: string): void {
  const jobs = getJobs();
  const idx = jobs.findIndex((j) => j.id === jobId);
  if (idx !== -1) {
    jobs[idx] = { ...jobs[idx], quotesCount: jobs[idx].quotesCount + 1 };
    persistToFile(jobs);
  }
}
