/**
 * Notification count helpers — SERVER ONLY.
 *
 * These functions derive unread/action-required counts from the mock stores.
 * Swap strategy: replace with API calls when backend is ready.
 */

import { findQuotesByJobId } from "./quote-store";
import { findJobsByClientId } from "@/lib/client/mock-store";
import { findConversationsByUserId, findMessagesByConversationId } from "@/lib/chat/mock-store";
import { getVerificationQueue } from "@/lib/admin/service";

/**
 * For clients: count of pending (unreviewed) quotes across all open jobs, and unread chats.
 */
export async function getClientNotificationCounts(
  userId: string
): Promise<{ pendingQuotes: number; unreadChats: number }> {
  const jobs = findJobsByClientId(userId).filter((j) => j.status === "open");
  let pendingQuotes = 0;
  for (const job of jobs) {
    const quotes = findQuotesByJobId(job.id);
    pendingQuotes += quotes.filter((q) => q.status === "pending").length;
  }

  const conversations = findConversationsByUserId(userId, "client");
  let unreadChats = 0;
  for (const convo of conversations) {
    const messages = findMessagesByConversationId(convo.id);
    const lastReadAt = convo.clientLastReadAt;
    const hasUnread = messages.some((msg) => {
      if (msg.senderId === userId) return false;
      if (!lastReadAt) return true;
      return msg.sentAt > lastReadAt;
    });
    if (hasUnread) unreadChats += 1;
  }

  return { pendingQuotes, unreadChats };
}

/**
 * For admins: count of verifications needing action (pending or in_review).
 */
export async function getAdminNotificationCounts(): Promise<{ pendingVerifications: number }> {
  const queue = getVerificationQueue("pending");
  const inReview = getVerificationQueue("in_review");
  const manualReview = getVerificationQueue("manual_review");
  return { pendingVerifications: queue.length + inReview.length + manualReview.length };
}

/**
 * For workers: count of conversations with unread messages from the client.
 */
export async function getWorkerNotificationCounts(
  userId: string
): Promise<{ unreadChats: number }> {
  const conversations = findConversationsByUserId(userId, "worker");
  let unreadChats = 0;
  for (const convo of conversations) {
    const messages = findMessagesByConversationId(convo.id);
    const lastReadAt = convo.workerLastReadAt;
    const hasUnread = messages.some((msg) => {
      if (msg.senderId === userId) return false;
      if (!lastReadAt) return true;
      return msg.sentAt > lastReadAt;
    });
    if (hasUnread) unreadChats += 1;
  }
  return { unreadChats };
}
