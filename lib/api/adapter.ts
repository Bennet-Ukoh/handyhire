/**
 * Service adapter interfaces — structural contracts for swapping mock services
 * with real API implementations.
 *
 * Usage: create a `RealApiAdapter` class implementing each interface,
 * then replace the corresponding mock service imports at call sites.
 *
 * The mock services already conform to these signatures — no changes needed
 * to existing code. These interfaces exist for documentation and future
 * type-checking of real implementations.
 */

import type { ClientProfile } from "@/lib/client/types";
import type { WorkerProfile } from "@/lib/worker/types";
import type { WorkerVerification } from "@/lib/worker/types";
import type { Conversation, Message } from "@/lib/chat/types";
import type { VerificationQueueItem, AdminStats, AdminCheckAction } from "@/lib/admin/types";
import type {
  PostJobRequest,
  PostJobResponse,
  AcceptQuoteResponse,
  SubmitQuoteRequest,
  SubmitQuoteResponse,
  SendMessageRequest,
  SendMessageResponse,
  ApproveCheckRequest,
  RejectCheckRequest,
  ManualReviewRequest,
  CompleteJobResponse,
} from "./contracts";

/* ── Client service adapter ─────────────────────────────────────────── */

export interface ClientServiceAdapter {
  // GET /api/clients/:userId/profile
  getProfile(userId: string): Promise<ClientProfile>;

  // POST /api/jobs
  postJob(clientId: string, req: PostJobRequest): Promise<PostJobResponse>;

  // POST /api/quotes/:quoteId/accept
  acceptQuote(clientId: string, quoteId: string): Promise<AcceptQuoteResponse>;

  // POST /api/quotes/:quoteId/decline
  declineQuote(clientId: string, quoteId: string): Promise<void>;

  // PATCH /api/jobs/:jobId/complete
  completeJob(clientId: string, jobId: string): Promise<CompleteJobResponse>;
}

/* ── Worker service adapter ─────────────────────────────────────────── */

export interface WorkerServiceAdapter {
  // GET /api/workers/:userId/profile
  getProfile(userId: string): Promise<WorkerProfile>;

  // POST /api/quotes
  submitQuote(workerId: string, req: SubmitQuoteRequest): Promise<SubmitQuoteResponse>;
}

/* ── Verification service adapter ───────────────────────────────────── */

export interface VerificationServiceAdapter {
  // GET /api/workers/:userId/verification
  getVerification(userId: string): Promise<WorkerVerification>;

  // PATCH /api/workers/:userId/verification/nin
  submitNIN(userId: string, nin: string): Promise<void>;

  // PATCH /api/workers/:userId/verification/background-check
  startBackgroundCheck(userId: string): Promise<void>;
}

/* ── Chat service adapter ───────────────────────────────────────────── */

export interface ChatServiceAdapter {
  // GET /api/conversations/:id
  getConversation(id: string): Promise<Conversation | null>;

  // GET /api/conversations/:id/messages
  getMessages(conversationId: string): Promise<Message[]>;

  // POST /api/conversations/:id/messages
  sendMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    senderRole: "client" | "worker",
    req: SendMessageRequest
  ): Promise<SendMessageResponse>;
}

/* ── Admin service adapter ──────────────────────────────────────────── */

export interface AdminServiceAdapter {
  // GET /api/admin/verifications
  getVerificationQueue(filter: string): Promise<VerificationQueueItem[]>;

  // GET /api/admin/stats
  getStats(): Promise<AdminStats>;

  // POST /api/admin/verifications/approve
  approveCheck(adminId: string, req: ApproveCheckRequest): Promise<void>;

  // POST /api/admin/verifications/reject
  rejectCheck(adminId: string, req: RejectCheckRequest): Promise<void>;

  // POST /api/admin/verifications/manual-review
  requestManualReview(adminId: string, req: ManualReviewRequest): Promise<void>;

  // GET /api/admin/audit-log
  getAuditLog(workerId?: string): Promise<AdminCheckAction[]>;
}
