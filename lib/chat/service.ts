/**
 * Chat service — mock implementation.
 *
 * Swap strategy: replace each function body with an API call.
 * Signatures and return types stay identical.
 */

import type { Conversation, ConversationPreview, Message } from "./types";
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

export async function getConversationPreviews(
  userId: string,
  role: "client" | "worker"
): Promise<ConversationPreview[]> {
  const conversations = findConversationsByUserId(userId, role);

  const previews: ConversationPreview[] = conversations.map((convo) => {
    const messages = findMessagesByConversationId(convo.id);
    const lastReadAt = role === "client" ? convo.clientLastReadAt : convo.workerLastReadAt;

    const unreadCount = messages.filter((msg) => {
      if (msg.senderId === userId) return false;
      if (!lastReadAt) return true;
      return msg.sentAt > lastReadAt;
    }).length;

    return { ...convo, unreadCount };
  });

  previews.sort((a, b) => {
    const aTime = a.lastMessageAt ?? a.createdAt;
    const bTime = b.lastMessageAt ?? b.createdAt;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  return previews;
}
