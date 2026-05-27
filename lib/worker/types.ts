/**
 * Worker domain types.
 *
 * All UI and service code imports from here. Update types first when the
 * backend shape changes — callers break at compile time, not at runtime.
 */

/* ── Verification ───────────────────────────────────────────────────── */

export type VerificationStatus =
  | "unverified"     // not yet submitted
  | "pending"        // submitted, awaiting admin review
  | "in_review"      // actively being reviewed by admin
  | "manual_review"  // flagged for manual admin review
  | "verified"       // approved by admin
  | "rejected";      // rejected by admin — action required

/** Data returned from a NIN lookup (mock NIMC API). Stored for admin review. */
export interface NINLookupData {
  nin: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phoneNumber: string;
  location: string;      // state/city
  photoUrl: string;      // SVG data URL (mock); signed URL (real)
  dateOfBirth?: string;  // YYYY-MM-DD
  gender?: "M" | "F";
}

export type DocumentType = "trade_test" | "work_photo" | "other";

export interface VerificationDocument {
  id: string;
  type: DocumentType;
  label: string;
  dataUrl: string;     // base64 data URL (mock); CDN URL (real)
  uploadedAt: string;  // ISO
}

export interface VerificationRecord {
  status: VerificationStatus;
  submittedAt?: string;       // ISO — when worker submitted
  reviewedAt?: string;        // ISO — when admin reviewed
  rejectionReason?: string;
  ninLookupData?: NINLookupData;  // returned from NIN API; stored for admin review
  ninConfirmedAt?: string;        // ISO — when worker confirmed data is theirs
}

export interface WorkerVerification {
  nin: VerificationRecord;
  backgroundCheck: VerificationRecord;
  documents?: VerificationDocument[];  // optional supporting documents
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
