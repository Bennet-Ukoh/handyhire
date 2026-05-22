import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getConversation, getMessages } from "@/lib/chat/service";
import ChatWindow from "@/components/shared/ChatWindow";

export const metadata: Metadata = { title: "Chat — HandyHire" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/auth/signin");

  const [conversation, messages] = await Promise.all([
    getConversation(id),
    getMessages(id),
  ]);

  if (!conversation) notFound();

  // Only the two participants may view this conversation
  const isParticipant =
    conversation.clientId === session.userId ||
    conversation.workerId === session.userId;
  if (!isParticipant) redirect("/dashboard");

  const otherPartyName =
    session.userId === conversation.clientId
      ? conversation.workerName
      : conversation.clientName;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        height: "calc(100vh - 7rem)",
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        background: "#FFFFFF",
        maxWidth: "48rem",
        margin: "0 auto",
      }}
    >
      <ChatWindow
        conversationId={id}
        jobTitle={conversation.jobTitle}
        otherPartyName={otherPartyName}
        initialMessages={messages}
        currentUserId={session.userId}
        currentUserRole={session.role as "client" | "worker"}
      />
    </div>
  );
}
