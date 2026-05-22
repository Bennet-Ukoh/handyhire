/**
 * Client domain types.
 *
 * Update types first when the backend shape changes — callers break at
 * compile time, not at runtime.
 */

/* ── Jobs ───────────────────────────────────────────────────────────── */

export type JobStatus =
  | "draft"        // saved, not yet posted
  | "open"         // live, accepting quotes
  | "in_progress"  // worker hired, work underway
  | "completed"    // work finished and confirmed
  | "cancelled";   // cancelled by client

export type JobUrgency = "normal" | "urgent";

export interface ClientJob {
  id: string;
  title: string;
  description: string;
  category: string;
  status: JobStatus;
  budgetMinNgn: number;
  budgetMaxNgn: number;
  location: string;
  urgency: JobUrgency;
  postedAt: string;        // ISO
  quotesCount: number;
  photoUrls: string[];
  coordinates?: { lat: number; lng: number };
  hiredWorkerName?: string; // set when status is in_progress or completed
  hiredWorkerId?: string;   // set alongside hiredWorkerName
  completedAt?: string;    // ISO — set when status is completed
}

/* ── Received quotes ────────────────────────────────────────────────── */

export type ReceivedQuoteStatus = "pending" | "accepted" | "rejected" | "expired";

export interface ReceivedQuote {
  id: string;
  jobId: string;
  jobTitle: string;
  workerId: string;
  workerName: string;
  workerTrade: string;
  workerAverageRating: number;
  workerReviewCount: number;
  workerIsVerified: boolean;
  amountNgn: number;
  status: ReceivedQuoteStatus;
  submittedAt: string;  // ISO
  note?: string;
  conversationId?: string;
}

/* ── Stats ──────────────────────────────────────────────────────────── */

export interface ClientStats {
  jobsPosted: number;
  workersHired: number;
  totalSpentNgn: number;
  averageRatingGiven: number;
}

/* ── Full profile ───────────────────────────────────────────────────── */

export interface ClientProfile {
  userId: string;
  name: string;
  email: string;
  location?: string;
  recentJobs: ClientJob[];
  receivedQuotes: ReceivedQuote[];  // quotes on open jobs only
  stats: ClientStats;
}
