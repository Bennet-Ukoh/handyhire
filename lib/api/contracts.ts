/**
 * API contracts — request/response DTOs for every future HTTP endpoint.
 *
 * STATUS: FROZEN — do not change these shapes without coordinating with the
 * backend team. UI code is already wired to these types; a breaking change
 * here will surface as a TypeScript error across callers.
 *
 * Each interface maps to a mock function below. To connect a real backend,
 * replace the mock function body with a fetch() call; all callers stay unchanged.
 *
 * Mock function → real endpoint mapping:
 *   lib/auth/service.ts         signIn()              → POST  /api/auth/signin
 *   lib/auth/service.ts         signUp()              → POST  /api/auth/signup
 *   lib/auth/service.ts         getUserById()         → GET   /api/users/:id
 *   lib/client/mock-store.ts    insertJob()           → POST  /api/jobs
 *   lib/client/mock-store.ts    findJobsByClientId()  → GET   /api/jobs?clientId=
 *   lib/client/mock-store.ts    findJobById()         → GET   /api/jobs/:id
 *   lib/client/mock-store.ts    findAllOpenJobs()     → GET   /api/jobs?status=open
 *   lib/client/mock-store.ts    updateJobStatus()     → PATCH /api/jobs/:id/status
 *   lib/shared/quote-store.ts   insertQuote()         → POST  /api/quotes
 *   lib/shared/quote-store.ts   findQuotesByJobId()   → GET   /api/jobs/:id/quotes
 *   lib/shared/quote-store.ts   findQuotesByWorkerId()→ GET   /api/quotes?workerId=
 *   lib/shared/quote-store.ts   updateQuoteStatus()   → PATCH /api/quotes/:id/status
 *   lib/worker/nin-service.ts   lookupNIN()           → GET   /api/nimc/verify?nin=
 *   lib/worker/verification-store.ts  getVerification()        → GET   /api/workers/:id/verification
 *   lib/worker/verification-store.ts  updateNINRecord()        → PATCH /api/workers/:id/verification/nin
 *   lib/worker/verification-store.ts  updateBGCheckRecord()    → PATCH /api/workers/:id/verification/background-check
 *   lib/worker/verification-store.ts  addDocuments()           → POST  /api/workers/:id/verification/documents
 *   lib/admin/service.ts        getVerificationQueue()→ GET   /api/admin/verifications?filter=
 *   lib/admin/actions.ts        approveCheckAction()  → POST  /api/admin/verifications/approve
 *   lib/admin/actions.ts        rejectCheckAction()   → POST  /api/admin/verifications/reject
 *   lib/admin/admin-log-store.ts insertAdminAction()  → POST  /api/admin/audit-log
 *   lib/chat/mock-store.ts      insertConversation()  → POST  /api/conversations
 *   lib/chat/mock-store.ts      insertMessage()       → POST  /api/conversations/:id/messages
 *
 * Route annotations below show the intended REST mapping for each DTO.
 */

import type { UserRole } from "@/lib/auth/types";
import type { JobUrgency, JobStatus } from "@/lib/client/types";
import type { VerificationStatus } from "@/lib/worker/types";

/* ── Auth ────────────────────────────────────────────────────────────── */

// POST /api/auth/signin
export interface SignInRequest {
  email: string;
  password: string;
}
export interface SignInResponse {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  trade?: string;
}

// POST /api/auth/signup
export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  trade?: string;
}
export type SignUpResponse = SignInResponse;

// POST /api/auth/signout — no body, no response body

/* ── Client — jobs ──────────────────────────────────────────────────── */

// GET /api/clients/:userId/profile — returns ClientProfile (already typed in lib/client/types.ts)

// POST /api/jobs
export interface PostJobRequest {
  title: string;
  category: string;
  description: string;
  budgetMinNgn: number;
  budgetMaxNgn: number;
  location: string;
  urgency: JobUrgency;
  photoUrls?: string[];
  coordinates?: { lat: number; lng: number };
}
export interface PostJobResponse {
  jobId: string;
}

// PATCH /api/jobs/:jobId/complete
export interface CompleteJobRequest {
  jobId: string;
}
export interface CompleteJobResponse {
  completedAt: string; // ISO
}

// GET /api/jobs — list with optional filters
export interface ListJobsQuery {
  clientId?: string;
  status?: JobStatus;
  category?: string;
  limit?: number;
  offset?: number;
}
export interface ListJobsResponse {
  jobs: JobSummary[];
  total: number;
}
export interface JobSummary {
  id: string;
  title: string;
  category: string;
  status: JobStatus;
  budgetMinNgn: number;
  budgetMaxNgn: number;
  location: string;
  urgency: JobUrgency;
  postedAt: string;
  quotesCount: number;
  hiredWorkerName?: string;
  hiredWorkerId?: string;
  completedAt?: string;
}

/* ── Client — quotes ────────────────────────────────────────────────── */

// POST /api/quotes/:quoteId/accept
export interface AcceptQuoteRequest {
  quoteId: string;
}
export interface AcceptQuoteResponse {
  conversationId: string;
}

// POST /api/quotes/:quoteId/decline
export interface DeclineQuoteRequest {
  quoteId: string;
}
export interface DeclineQuoteResponse {
  ok: boolean;
}

/* ── Worker ─────────────────────────────────────────────────────────── */

// GET /api/workers/:userId/profile — returns WorkerProfile (already typed in lib/worker/types.ts)

// POST /api/quotes
export interface SubmitQuoteRequest {
  jobId: string;
  amountNgn: number;
  note?: string;
}
export interface SubmitQuoteResponse {
  quoteId: string;
}

// GET /api/jobs/feed — trade-filtered open jobs for a worker
export interface JobFeedQuery {
  trade?: string;
  location?: string;
  limit?: number;
  offset?: number;
}

/* ── Verification ────────────────────────────────────────────────────── */

// GET /api/nimc/verify?nin=xxx — NIN lookup (NIMC proxy)
export interface NINLookupRequest {
  nin: string;
}
export interface NINLookupResponse {
  nin: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phoneNumber: string;
  location: string;
  photoUrl: string;   // signed CDN URL
  dateOfBirth?: string;
  gender?: "M" | "F";
}

// POST /api/workers/:userId/verification/nin/confirm
export interface ConfirmNINRequest {
  nin: string;
}
export interface ConfirmNINResponse {
  status: VerificationStatus;
  submittedAt: string;
  ninConfirmedAt: string;
}

// PATCH /api/workers/:userId/verification/background-check
export interface StartBGCheckRequest {
  consent: true;
}
export interface StartBGCheckResponse {
  status: VerificationStatus;
  submittedAt: string;
}

// POST /api/workers/:userId/verification/documents
export interface UploadDocumentsRequest {
  documents: Array<{
    type: "trade_test" | "work_photo" | "other";
    label: string;
    url: string;       // CDN URL (real); base64 data URL (mock)
  }>;
}
export interface UploadDocumentsResponse {
  uploaded: number;
}

// GET /api/workers/:userId/verification — returns WorkerVerification (already typed)

/* ── Admin ──────────────────────────────────────────────────────────── */

// GET /api/admin/verifications?filter=pending|in_review|manual_review|verified|rejected|all
export interface AdminVerificationQuery {
  filter?: "all" | "pending" | "in_review" | "manual_review" | "verified" | "rejected";
}

// POST /api/admin/verifications/approve
export interface ApproveCheckRequest {
  workerId: string;
  checkType: "nin" | "backgroundCheck";
}
export interface ApproveCheckResponse {
  ok: boolean;
  reviewedAt: string;
}

// POST /api/admin/verifications/reject
export interface RejectCheckRequest {
  workerId: string;
  checkType: "nin" | "backgroundCheck";
  reason: string;
}
export interface RejectCheckResponse {
  ok: boolean;
  reviewedAt: string;
}

// POST /api/admin/verifications/manual-review
export interface ManualReviewRequest {
  workerId: string;
  checkType: "nin" | "backgroundCheck";
  note?: string;
}

// GET /api/admin/stats — returns AdminStats (already typed in lib/admin/types.ts)

/* ── Chat ────────────────────────────────────────────────────────────── */

// GET /api/conversations/:id — returns Conversation (already typed in lib/chat/types.ts)

// GET /api/conversations/:id/messages — returns Message[] (already typed)

// POST /api/conversations/:id/messages
export interface SendMessageRequest {
  body: string;
}
export interface SendMessageResponse {
  messageId: string;
  sentAt: string; // ISO
}

// GET /api/conversations?userId=...&role=client|worker
export interface ListConversationsQuery {
  userId: string;
  role: "client" | "worker";
}
