/**
 * File-backed mock chat store — SERVER ONLY.
 *
 * Persistence: globalThis (HMR-safe) + JSON files (restart-safe).
 *
 * Swap strategy: delete this file and replace imports with API calls.
 */

import fs from "fs";
import path from "path";
import type { Conversation, Message } from "./types";

declare global {
  // eslint-disable-next-line no-var
  var __hhConversations: Conversation[] | undefined;
  // eslint-disable-next-line no-var
  var __hhMessages: Message[] | undefined;
}

const CONVOS_PATH = path.join(process.cwd(), ".mock-conversations.json");
const MSGS_PATH = path.join(process.cwd(), ".mock-messages.json");

const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: "conv_seed_001",
    jobId: "cj_002",
    jobTitle: "Air conditioner installation — 2 units",
    clientId: "usr_client_001",
    clientName: "Aisha Bello",
    workerId: "usr_worker_001",
    workerName: "Emeka Okonkwo",
    createdAt: "2026-05-16T09:00:00Z",
    lastMessageAt: "2026-05-16T10:15:00Z",
    lastMessageSnippet: "I'll be there at 10am tomorrow with all the tools needed.",
  },
];

const SEED_MESSAGES: Message[] = [
  {
    id: "msg_seed_001",
    conversationId: "conv_seed_001",
    senderId: "usr_client_001",
    senderName: "Aisha Bello",
    senderRole: "client",
    body: "Hi Emeka, thanks for accepting. When can you come for the AC installation?",
    sentAt: "2026-05-16T09:05:00Z",
  },
  {
    id: "msg_seed_002",
    conversationId: "conv_seed_001",
    senderId: "usr_worker_001",
    senderName: "Emeka Okonkwo",
    senderRole: "worker",
    body: "Good morning! I can come tomorrow morning. The installation for 2 split units should take about 3 hours.",
    sentAt: "2026-05-16T09:30:00Z",
  },
  {
    id: "msg_seed_003",
    conversationId: "conv_seed_001",
    senderId: "usr_client_001",
    senderName: "Aisha Bello",
    senderRole: "client",
    body: "Perfect, tomorrow works. Can you come by 9am?",
    sentAt: "2026-05-16T09:45:00Z",
  },
  {
    id: "msg_seed_004",
    conversationId: "conv_seed_001",
    senderId: "usr_worker_001",
    senderName: "Emeka Okonkwo",
    senderRole: "worker",
    body: "I'll be there at 10am tomorrow with all the tools needed.",
    sentAt: "2026-05-16T10:15:00Z",
  },
];

function loadConversations(): Conversation[] {
  try {
    const raw = fs.readFileSync(CONVOS_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Conversation[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch { /* fall through */ }
  return [...SEED_CONVERSATIONS];
}

function loadMessages(): Message[] {
  try {
    const raw = fs.readFileSync(MSGS_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Message[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch { /* fall through */ }
  return [...SEED_MESSAGES];
}

function getConversations(): Conversation[] {
  if (!global.__hhConversations) {
    global.__hhConversations = loadConversations();
  }
  return global.__hhConversations;
}

function getMessages(): Message[] {
  if (!global.__hhMessages) {
    global.__hhMessages = loadMessages();
  }
  return global.__hhMessages;
}

function persistConversations(convos: Conversation[]): void {
  try {
    fs.writeFileSync(CONVOS_PATH, JSON.stringify(convos, null, 2), "utf-8");
  } catch { /* non-fatal */ }
}

function persistMessages(msgs: Message[]): void {
  try {
    fs.writeFileSync(MSGS_PATH, JSON.stringify(msgs, null, 2), "utf-8");
  } catch { /* non-fatal */ }
}

export function findConversationById(id: string): Conversation | undefined {
  return getConversations().find((c) => c.id === id);
}

export function findConversationsByUserId(
  userId: string,
  role: "client" | "worker"
): Conversation[] {
  const field = role === "client" ? "clientId" : "workerId";
  return getConversations().filter((c) => c[field] === userId);
}

export function insertConversation(convo: Conversation): void {
  const convos = getConversations();
  convos.unshift(convo);
  persistConversations(convos);
}

export function updateConversationMeta(
  conversationId: string,
  lastMessageAt: string,
  lastMessageSnippet: string
): void {
  const convos = getConversations();
  const idx = convos.findIndex((c) => c.id === conversationId);
  if (idx !== -1) {
    convos[idx] = { ...convos[idx], lastMessageAt, lastMessageSnippet };
    persistConversations(convos);
  }
}

export function findMessagesByConversationId(conversationId: string): Message[] {
  return getMessages()
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
}

export function insertMessage(msg: Message): void {
  const msgs = getMessages();
  msgs.push(msg);
  persistMessages(msgs);
}
