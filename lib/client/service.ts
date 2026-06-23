/**
 * Client service — mock implementation.
 *
 * Swap strategy: replace each function body with the equivalent API call.
 * Signatures, return types, and import paths stay identical — UI never changes.
 */

import type { ClientProfile, ReceivedQuote } from "./types";
import { findJobsByClientId } from "./mock-store";
import { getStoredClientProfile, isClientProfileComplete } from "./profile-store";
import { findQuotesByJobId } from "@/lib/shared/quote-store";
import { getVerification } from "@/lib/worker/verification-store";
import { findById } from "@/lib/auth/mock-store";

function isWorkerVerified(workerId: string): boolean {
  const v = getVerification(workerId);
  return v.nin.status === "verified" && v.backgroundCheck.status === "verified";
}

function simulateDelay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ── Mock data ──────────────────────────────────────────────────────── */

const MOCK_PROFILES: Record<string, Omit<ClientProfile, "profileComplete">> = {
  usr_client_001: {
    userId: "usr_client_001",
    name: "Aisha Bello",
    email: "client@test.com",
    location: "Lagos, Surulere",
    stats: {
      jobsPosted: 5,
      workersHired: 4,
      totalSpentNgn: 220_000,
      averageRatingGiven: 4.8,
    },
    recentJobs: [
      {
        id: "cj_001",
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
      },
      {
        id: "cj_003",
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
        completedAt: "2026-04-28T16:00:00Z",
      },
    ],
    receivedQuotes: [
      {
        id: "rq_001",
        jobId: "cj_001",
        jobTitle: "Complete bathroom retiling and plumbing fix",
        workerId: "usr_worker_tunde",
        workerName: "Tunde Fashola",
        workerTrade: "Plumbing",
        workerAverageRating: 4.9,
        workerReviewCount: 32,
        workerIsVerified: true,
        amountNgn: 62_000,
        status: "pending",
        submittedAt: "2026-05-18T14:30:00Z",
        note: "I've completed over 40 bathroom renovations across Lagos. This job looks straightforward — I can start Thursday.",
      },
      {
        id: "rq_002",
        jobId: "cj_001",
        jobTitle: "Complete bathroom retiling and plumbing fix",
        workerId: "usr_worker_bola",
        workerName: "Bola Adekunle",
        workerTrade: "Plumbing",
        workerAverageRating: 4.6,
        workerReviewCount: 15,
        workerIsVerified: true,
        amountNgn: 55_000,
        status: "pending",
        submittedAt: "2026-05-19T08:00:00Z",
        note: "Price includes all materials and labour. I can provide photos of previous work.",
      },
      {
        id: "rq_003",
        jobId: "cj_001",
        jobTitle: "Complete bathroom retiling and plumbing fix",
        workerId: "usr_worker_chidi",
        workerName: "Chidi Nwosu",
        workerTrade: "Plumbing",
        workerAverageRating: 4.3,
        workerReviewCount: 8,
        workerIsVerified: false,
        amountNgn: 41_000,
        status: "pending",
        submittedAt: "2026-05-19T11:00:00Z",
      },
    ],
  },
};

const EMPTY_DEFAULT: Omit<ClientProfile, "profileComplete"> = {
  userId: "",
  name: "",
  email: "",
  stats: {
    jobsPosted: 0,
    workersHired: 0,
    totalSpentNgn: 0,
    averageRatingGiven: 0,
  },
  recentJobs: [],
  receivedQuotes: [],
};

/* ── Public API ─────────────────────────────────────────────────────── */

/**
 * Fetch the complete client profile.
 * Replace body with: GET /api/clients/:userId/profile
 */
export async function getClientProfile(userId: string): Promise<ClientProfile> {
  await simulateDelay(300);
  const profile = MOCK_PROFILES[userId];
  if (!profile) {
    const user = findById(userId);
    const storedProfile = getStoredClientProfile(userId);
    return {
      ...EMPTY_DEFAULT,
      userId,
      name: user?.name ?? "",
      email: user?.email ?? "",
      location: storedProfile?.location,
      phone: storedProfile?.phone,
      profileComplete: isClientProfileComplete(userId),
    };
  }

  const recentJobs = findJobsByClientId(userId).slice(0, 10);
  const jobsPosted = recentJobs.length;
  const workersHired = recentJobs.filter(
    (j) => j.status === "in_progress" || j.status === "completed"
  ).length;

  // Pull quotes for open + in_progress jobs (accepted quotes live on in_progress jobs)
  const openJobIds = recentJobs
    .filter((j) => j.status === "open" || j.status === "in_progress")
    .map((j) => j.id);

  const receivedQuotes: ReceivedQuote[] = openJobIds.flatMap((jobId) =>
    findQuotesByJobId(jobId).map((q) => ({
      id: q.id,
      jobId: q.jobId,
      jobTitle: q.jobTitle,
      workerId: q.workerId,
      workerName: q.workerName,
      workerTrade: q.workerTrade,
      workerAverageRating: q.workerAverageRating,
      workerReviewCount: q.workerReviewCount,
      workerIsVerified: isWorkerVerified(q.workerId),
      amountNgn: q.amountNgn,
      status: q.status as ReceivedQuote["status"],
      submittedAt: q.submittedAt,
      note: q.note,
      conversationId: q.conversationId,
    }))
  );

  const storedProfile = getStoredClientProfile(userId);

  return {
    ...profile,
    location: storedProfile?.location ?? profile.location,
    phone: storedProfile?.phone,
    profileComplete: isClientProfileComplete(userId),
    recentJobs,
    receivedQuotes,
    stats: { ...profile.stats, jobsPosted, workersHired },
  };
}
