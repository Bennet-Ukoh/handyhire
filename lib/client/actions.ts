"use server";

import { getSession } from "@/lib/auth/session";
import { postJobSchema } from "./schemas";
import { insertJob, findJobById, updateJobStatus } from "./mock-store";
import {
  findQuoteById,
  updateQuoteStatus,
  updateQuoteConversationId,
  rejectOtherQuotes,
} from "@/lib/shared/quote-store";
import {
  insertConversation,
} from "@/lib/chat/mock-store";
import type { ActionState } from "@/lib/auth/types";

export type PostJobState = ActionState & { success?: boolean; jobId?: string; jobTitle?: string };

export async function postJobAction(
  _prev: PostJobState | null,
  formData: FormData
): Promise<PostJobState> {
  const session = await getSession();
  if (!session || session.role !== "client") {
    return { error: "You must be signed in as a client to post a job." };
  }

  const raw = {
    title: formData.get("title"),
    category: formData.get("category"),
    description: formData.get("description"),
    budgetMinNgn: formData.get("budgetMinNgn"),
    budgetMaxNgn: formData.get("budgetMaxNgn"),
    location: formData.get("location"),
    urgency: formData.get("urgency"),
    photoUrls: formData.get("photoUrls") || undefined,
    lat: formData.get("lat") || undefined,
    lng: formData.get("lng") || undefined,
  };

  const parsed = postJobSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: parsed.error.issues[0].message, fieldErrors };
  }

  const { photoUrls, lat, lng, ...rest } = parsed.data;
  const jobId = `cj_${Date.now()}`;

  insertJob({
    clientId: session.userId,
    ...rest,
    photoUrls,
    coordinates: lat != null && lng != null ? { lat, lng } : undefined,
    id: jobId,
    status: "open",
    postedAt: new Date().toISOString(),
    quotesCount: 0,
  });

  return { success: true, jobId, jobTitle: rest.title };
}

export async function acceptQuoteAction(quoteId: string): Promise<ActionState> {
  const session = await getSession();
  if (!session || session.role !== "client") {
    return { error: "Not authenticated." };
  }

  const quote = findQuoteById(quoteId);
  if (!quote) return { error: "Quote not found." };

  // Mark this quote accepted
  updateQuoteStatus(quoteId, "accepted");

  // Transition the job to in_progress and record the hired worker
  const job = findJobById(quote.jobId);
  if (job) {
    updateJobStatus(quote.jobId, "in_progress", {
      hiredWorkerName: quote.workerName,
      hiredWorkerId: quote.workerId,
    });
  }

  // Auto-reject all other pending quotes on the same job
  rejectOtherQuotes(quote.jobId, quoteId);

  // Create a conversation so both parties can chat
  const conversationId = `conv_${Date.now()}`;
  const clientProfile = job
    ? { clientId: session.userId, clientName: session.name }
    : { clientId: session.userId, clientName: session.name };

  insertConversation({
    id: conversationId,
    jobId: quote.jobId,
    jobTitle: quote.jobTitle,
    clientId: session.userId,
    clientName: session.name,
    workerId: quote.workerId,
    workerName: quote.workerName,
    createdAt: new Date().toISOString(),
  });

  // Write conversationId back to both quote records (client + worker view)
  updateQuoteConversationId(quoteId, conversationId);

  return {};
}

export async function declineQuoteAction(quoteId: string): Promise<ActionState> {
  const session = await getSession();
  if (!session || session.role !== "client") {
    return { error: "Not authenticated." };
  }

  const quote = findQuoteById(quoteId);
  if (!quote) return { error: "Quote not found." };

  updateQuoteStatus(quoteId, "rejected");
  return {};
}

export async function completeJobAction(jobId: string): Promise<ActionState> {
  const session = await getSession();
  if (!session || session.role !== "client") {
    return { error: "Not authenticated." };
  }

  const job = findJobById(jobId);
  if (!job) return { error: "Job not found." };
  if (job.clientId !== session.userId) return { error: "Not authorised." };
  if (job.status !== "in_progress") return { error: "Only in-progress jobs can be marked complete." };

  updateJobStatus(jobId, "completed", { completedAt: new Date().toISOString() });
  return {};
}
