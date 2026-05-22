"use server";

import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import {
  findConversationById,
  insertMessage,
  updateConversationMeta,
  findMessagesByConversationId,
} from "./mock-store";
import type { ActionState } from "@/lib/auth/types";
import type { Message } from "./types";

const sendMessageSchema = z.object({
  conversationId: z.string().min(1),
  body: z.string().min(1, "Message cannot be empty").max(2000, "Message is too long"),
});

export async function sendMessageAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };
  if (session.role === "admin") return { error: "Admins cannot send messages." };

  const parsed = sendMessageSchema.safeParse({
    conversationId: formData.get("conversationId"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { conversationId, body } = parsed.data;

  const convo = findConversationById(conversationId);
  if (!convo) return { error: "Conversation not found." };

  const isParticipant =
    convo.clientId === session.userId || convo.workerId === session.userId;
  if (!isParticipant) return { error: "Not authorised." };

  const msg: Message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    conversationId,
    senderId: session.userId,
    senderName: session.name,
    senderRole: session.role as "client" | "worker",
    body,
    sentAt: new Date().toISOString(),
  };

  insertMessage(msg);
  updateConversationMeta(conversationId, msg.sentAt, body.slice(0, 80));

  return {};
}

export async function getMessagesAction(
  conversationId: string
): Promise<Message[]> {
  const session = await getSession();
  if (!session) return [];

  const convo = findConversationById(conversationId);
  if (!convo) return [];

  const isParticipant =
    convo.clientId === session.userId || convo.workerId === session.userId;
  if (!isParticipant) return [];

  return findMessagesByConversationId(conversationId);
}
