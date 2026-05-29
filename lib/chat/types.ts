/**
 * Chat domain types.
 *
 * A Conversation is created when a client accepts a worker's quote.
 * Messages are appended to a conversation by either participant.
 */

export interface Conversation {
  id: string;
  jobId: string;
  jobTitle: string;
  clientId: string;
  clientName: string;
  workerId: string;
  workerName: string;
  createdAt: string;           // ISO
  lastMessageAt?: string;      // ISO — updated on each new message
  lastMessageSnippet?: string; // truncated for conversation list previews
  clientLastReadAt?: string;   // ISO — client's last read position
  workerLastReadAt?: string;   // ISO — worker's last read position
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: "client" | "worker";
  body: string;
  sentAt: string; // ISO
}

export interface ConversationPreview extends Conversation {
  unreadCount: number;
}
