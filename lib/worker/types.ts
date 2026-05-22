/**
 * Worker domain types.
 *
 * All UI and service code imports from here. Update types first when the
 * backend shape changes — callers break at compile time, not at runtime.
 */

/* ── Verification ───────────────────────────────────────────────────── */

export type VerificationStatus =
  | "unverified"     // not yet submitted
  | "pending"        // submitted, queued for review
  | "in_review"      // actively being reviewed
  | "manual_review"  // flagged for manual admin review
  | "verified"       // approved
  | "rejected";      // rejected — action required

export interface VerificationRecord {
  status: VerificationStatus;
  submittedAt?: string;  // ISO
  reviewedAt?: string;   // ISO
  rejectionReason?: string;
}

export interface WorkerVerification {
  nin: VerificationRecord;
  backgroundCheck: VerificationRecord;
}

export type OverallVerificationStatus =
  | "incomplete"   // one or more items not submitted
  | "in_progress"  // all submitted, not yet verified
  | "verified"     // both fully verified
  | "rejected";    // one or more rejected

export function deriveOverallStatus(
  v: WorkerVerification
): OverallVerificationStatus {
  const statuses = [v.nin.status, v.backgroundCheck.status];
  if (statuses.some((s) => s === "rejected")) return "rejected";
  if (statuses.every((s) => s === "verified")) return "verified";
  if (statuses.some((s) => s === "unverified")) return "incomplete";
  return "in_progress";
}

/* ── Profile completeness ───────────────────────────────────────────── */

export type ProfileStepKey =
  | "photo"
  | "bio"
  | "trade"
  | "location"
  | "phone"
  | "portfolio";

export const PROFILE_STEP_LABELS: Record<ProfileStepKey, string> = {
  photo:     "Profile photo",
  bio:       "Professional bio",
  trade:     "Primary trade",
  location:  "Service location",
  phone:     "Phone number",
  portfolio: "Portfolio samples",
};

export interface ProfileCompleteness {
  percentage: number;
  completedSteps: ProfileStepKey[];
  pendingSteps: ProfileStepKey[];
}

/* ── Stats ──────────────────────────────────────────────────────────── */

export interface WorkerStats {
  jobsCompleted: number;
  averageRating: number;
  reviewCount: number;
  totalEarningsNgn: number;
  responseRatePercent: number;
}

/* ── Quotes ─────────────────────────────────────────────────────────── */

export type QuoteStatus = "sent" | "accepted" | "rejected" | "expired";

export interface ActiveQuote {
  id: string;
  jobId: string;
  jobTitle: string;
  amountNgn: number;
  status: QuoteStatus;
  submittedAt: string;  // ISO
  clientName: string;
  location: string;
  note?: string;
  conversationId?: string;
}

/* ── Jobs ───────────────────────────────────────────────────────────── */

export type JobUrgency = "normal" | "urgent";

export interface NearbyJob {
  id: string;
  title: string;
  description: string;
  trade: string;
  location: string;
  budgetMinNgn: number;
  budgetMaxNgn: number;
  postedAt: string;  // ISO
  urgency: JobUrgency;
  quotesCount: number;
  distanceKm: number;
  clientName: string;
  photoUrls: string[];
}

/* ── Full profile ───────────────────────────────────────────────────── */

export interface WorkerProfile {
  userId: string;
  name: string;
  email: string;
  trade?: string;
  location?: string;
  bio?: string;
  phoneNumber?: string;
  verification: WorkerVerification;
  completeness: ProfileCompleteness;
  stats: WorkerStats;
  activeQuotes: ActiveQuote[];
  nearbyJobs: NearbyJob[];
}
