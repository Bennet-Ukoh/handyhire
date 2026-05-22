/**
 * Chat service — mock implementation.
 *
 * Swap strategy: replace each function body with an API call.
 * Signatures and return types stay identical.
 */

import type { Conversation, Message } from "./types";
import {
  findConversationById,
  findConversationsByUserId,
  findMessagesByConversationId,
} from "./mock-store";

export async function getConversation(id: string): Promise<Conversation | null> {
  return findConversationById(id) ?? null;
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  return findMessagesByConversationId(conversationId);
}

export async function getConversationsForUser(
  userId: string,
  role: "client" | "worker"
): Promise<Conversation[]> {
  return findConversationsByUserId(userId, role);
}
