/**
 * Worker service — mock implementation.
 *
 * Swap strategy: replace each function body with the equivalent API call.
 * Signatures, return types, and import paths stay identical — UI never changes.
 */

import type { WorkerProfile, ActiveQuote, NearbyJob } from "./types";
import { deriveOverallStatus } from "./types";
import { findQuotesByWorkerId } from "@/lib/shared/quote-store";
import type { StoredQuote } from "@/lib/shared/quote-store";
import { findAllOpenJobs, findJobsByHiredWorkerId } from "@/lib/client/mock-store";
import { findById as findUserById } from "@/lib/auth/mock-store";
import { getVerification } from "./verification-store";

function simulateDelay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildNearbyJobs(trade: string | undefined, excludeIds: Set<string>): NearbyJob[] {
  return findAllOpenJobs()
    .filter((j) => !excludeIds.has(j.id))
    .filter((j) => !trade || j.category === trade)
    .map((j) => {
      const clientUser = findUserById(j.clientId);
      return {
        id: j.id,
        title: j.title,
        description: j.description,
        trade: j.category,
        location: j.location,
        budgetMinNgn: j.budgetMinNgn,
        budgetMaxNgn: j.budgetMaxNgn,
        postedAt: j.postedAt,
        urgency: j.urgency,
        quotesCount: j.quotesCount,
        distanceKm: 2.0,
        clientName: clientUser?.name ?? "Client",
        photoUrls: j.photoUrls,
      };
    });
}

function deriveWorkerStats(workerId: string, quotes: StoredQuote[]) {
  const completedJobs = findJobsByHiredWorkerId(workerId);
  const acceptedQuotes = quotes.filter((q) => q.status === "accepted");
  const totalEarningsNgn = acceptedQuotes.reduce((sum, q) => sum + q.amountNgn, 0);
  const responseRatePercent =
    quotes.length > 0 ? Math.round((acceptedQuotes.length / quotes.length) * 100) : 0;
  return { jobsCompleted: completedJobs.length, totalEarningsNgn, responseRatePercent };
}

/* ── Mock data ──────────────────────────────────────────────────────── */

const MOCK_PROFILES: Record<string, WorkerProfile> = {
  usr_worker_001: {
    userId: "usr_worker_001",
    name: "Emeka Okonkwo",
    email: "worker@test.com",
    trade: "Plumbing",
    location: "Abuja, Wuse II",
    verification: {
      nin: {
        status: "verified",
        submittedAt: "2026-05-10T09:00:00Z",
        reviewedAt: "2026-05-15T14:30:00Z",
      },
      backgroundCheck: {
        status: "verified",
        submittedAt: "2026-05-18T11:00:00Z",
        reviewedAt: "2026-05-20T09:00:00Z",
      },
    },
    completeness: {
      percentage: 60,
      completedSteps: ["trade", "location"],
      pendingSteps: ["photo", "bio", "phone", "portfolio"],
    },
    stats: {
      jobsCompleted: 24,
      averageRating: 4.8,
      reviewCount: 21,
      totalEarningsNgn: 840_000,
      responseRatePercent: 94,
    },
    activeQuotes: [
      {
        id: "q_001",
        jobId: "job_001",
        jobTitle: "Kitchen pipe burst repair",
        amountNgn: 18_000,
        status: "sent",
        submittedAt: "2026-05-19T08:30:00Z",
        clientName: "Mrs. Aisha Bello",
        location: "Ikeja, Lagos",
      },
      {
        id: "q_002",
        jobId: "job_002",
        jobTitle: "Bathroom tap replacement",
        amountNgn: 8_500,
        status: "accepted",
        submittedAt: "2026-05-18T14:00:00Z",
        clientName: "Mr. Tunde Adeyemi",
        location: "Yaba, Lagos",
      },
      {
        id: "q_003",
        jobId: "job_003",
        jobTitle: "Water heater installation",
        amountNgn: 35_000,
        status: "sent",
        submittedAt: "2026-05-17T10:15:00Z",
        clientName: "Kolade Properties",
        location: "Lekki, Lagos",
      },
    ],
    nearbyJobs: [
      {
        id: "nj_001",
        title: "Urgent: main pipe burst in kitchen",
        description: "Water is coming from under the sink and flooding the kitchen floor. Need someone ASAP.",
        trade: "Plumbing",
        location: "Wuse II, Abuja",
        budgetMinNgn: 15_000,
        budgetMaxNgn: 25_000,
        postedAt: "2026-05-20T07:30:00Z",
        urgency: "urgent",
        quotesCount: 2,
        distanceKm: 1.2,
        clientName: "Mrs. Fatima Aliyu",
        photoUrls: [],
      },
      {
        id: "nj_002",
        title: "Bathroom complete pipe installation",
        description: "New bathroom being fitted in a 3-bedroom flat. All pipes need to be laid fresh including waste pipes.",
        trade: "Plumbing",
        location: "Garki, Abuja",
        budgetMinNgn: 40_000,
        budgetMaxNgn: 70_000,
        postedAt: "2026-05-20T06:00:00Z",
        urgency: "normal",
        quotesCount: 1,
        distanceKm: 3.4,
        clientName: "Mr. Hassan Danjuma",
        photoUrls: [],
      },
      {
        id: "nj_003",
        title: "Water heater replacement",
        description: "10-litre storage heater stopped working. Looking for a plumber to supply and install a replacement.",
        trade: "Plumbing",
        location: "Maitama, Abuja",
        budgetMinNgn: 30_000,
        budgetMaxNgn: 50_000,
        postedAt: "2026-05-19T22:00:00Z",
        urgency: "normal",
        quotesCount: 3,
        distanceKm: 5.1,
        clientName: "Kolade Properties",
        photoUrls: [],
      },
      {
        id: "nj_004",
        title: "Fix leaking bathroom faucet",
        description: "Cold water tap in the main bathroom drips constantly. Should be a quick job.",
        trade: "Plumbing",
        location: "Jabi, Abuja",
        budgetMinNgn: 3_000,
        budgetMaxNgn: 7_000,
        postedAt: "2026-05-19T18:00:00Z",
        urgency: "normal",
        quotesCount: 0,
        distanceKm: 7.8,
        clientName: "Mrs. Ngozi Obi",
        photoUrls: [],
      },
    ],
  },
};

const UNVERIFIED_DEFAULT: WorkerProfile = {
  userId: "",
  name: "",
  email: "",
  verification: {
    nin: { status: "unverified" },
    backgroundCheck: { status: "unverified" },
  },
  completeness: {
    percentage: 10,
    completedSteps: [],
    pendingSteps: ["photo", "bio", "trade", "location", "phone", "portfolio"],
  },
  stats: {
    jobsCompleted: 0,
    averageRating: 0,
    reviewCount: 0,
    totalEarningsNgn: 0,
    responseRatePercent: 0,
  },
  activeQuotes: [],
  nearbyJobs: [],
};

/* ── Public API ─────────────────────────────────────────────────────── */

/**
 * Fetch the complete worker profile.
 * Replace body with: GET /api/workers/:userId/profile
 */
export async function getWorkerProfile(userId: string): Promise<WorkerProfile> {
  await simulateDelay(300);

  const storedQuotes = findQuotesByWorkerId(userId);
  const quotedJobIds = new Set(storedQuotes.map((q) => q.jobId));
  const verification = getVerification(userId);

  const activeQuotes: ActiveQuote[] = storedQuotes.map((q) => ({
    id: q.id,
    jobId: q.jobId,
    jobTitle: q.jobTitle,
    amountNgn: q.amountNgn,
    status: (q.status === "pending" ? "sent" : q.status) as ActiveQuote["status"],
    submittedAt: q.submittedAt,
    clientName: q.clientName,
    location: q.location,
    note: q.note,
    conversationId: q.conversationId,
  }));

  const profile = MOCK_PROFILES[userId];

  if (!profile) {
    // Worker signed up but has no mock profile entry — build from user record + live data
    const user = findUserById(userId);
    const overall = deriveOverallStatus(verification);
    const nearbyJobs = overall === "verified"
      ? buildNearbyJobs(user?.trade, quotedJobIds)
      : [];
    const liveStats = deriveWorkerStats(userId, storedQuotes);
    return {
      ...UNVERIFIED_DEFAULT,
      userId,
      name: user?.name ?? "",
      email: user?.email ?? "",
      trade: user?.trade,
      location: user?.location,
      verification,
      activeQuotes,
      nearbyJobs,
      stats: { ...UNVERIFIED_DEFAULT.stats, ...liveStats },
    };
  }

  // For known profile entries: merge live jobs (trade-filtered) with hardcoded ones,
  // then exclude jobs already quoted by this worker
  const hardcodedIds = new Set(profile.nearbyJobs.map((j) => j.id));
  const liveJobs = buildNearbyJobs(profile.trade, new Set([...hardcodedIds, ...quotedJobIds]));
  const hardcodedFiltered = profile.nearbyJobs.filter((j) => !quotedJobIds.has(j.id));
  const nearbyJobs = [...liveJobs, ...hardcodedFiltered];

  const liveStats = deriveWorkerStats(userId, storedQuotes);
  const stats = {
    ...profile.stats,
    jobsCompleted: liveStats.jobsCompleted || profile.stats.jobsCompleted,
    totalEarningsNgn: liveStats.totalEarningsNgn || profile.stats.totalEarningsNgn,
    responseRatePercent: storedQuotes.length > 0 ? liveStats.responseRatePercent : profile.stats.responseRatePercent,
  };

  return { ...profile, activeQuotes, nearbyJobs, verification, stats };
}
