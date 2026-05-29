"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { sendMessageAction, getMessagesAction, markReadAction } from "@/lib/chat/actions";
import type { ActionState } from "@/lib/auth/types";
import type { Message } from "@/lib/chat/types";

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

interface Props {
  conversationId: string;
  jobTitle: string;
  otherPartyName: string;
  initialMessages: Message[];
  currentUserId: string;
  currentUserRole: "client" | "worker";
}

export default function ChatWindow({
  conversationId,
  jobTitle,
  otherPartyName,
  initialMessages,
  currentUserId,
  currentUserRole,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    sendMessageAction,
    null
  );
  const [isPolling] = useTransition();
  const listRef = useRef<HTMLUListElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Mark conversation as read on open
  useEffect(() => {
    markReadAction(conversationId).catch(() => {});
  }, [conversationId]);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const fresh = await getMessagesAction(conversationId);
        setMessages(fresh);
        markReadAction(conversationId).catch(() => {});
      } catch { /* ignore polling errors */ }
    }, 3000);
    return () => clearInterval(id);
  }, [conversationId]);

  // Clear input and update local state on successful send
  useEffect(() => {
    if (state !== null && !state.error) {
      formRef.current?.reset();
      getMessagesAction(conversationId).then(setMessages).catch(() => {});
    }
  }, [state, conversationId]);

  // Group messages by date for date separators
  let lastDate = "";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="px-5 py-4 border-b flex-shrink-0"
        style={{ borderColor: "rgba(0,0,0,0.07)", background: "#FFFFFF" }}
      >
        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-0.5">
          {currentUserRole === "client" ? "Worker" : "Client"}
        </p>
        <h2 className="font-display text-lg text-stone-900 leading-tight">{otherPartyName}</h2>
        <p className="text-xs text-stone-500 mt-0.5 truncate">{jobTitle}</p>
      </div>

      {/* Messages */}
      <ul
        ref={listRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-1 scroll-smooth"
        style={{ background: "#FDFAF5" }}
        aria-label="Messages"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <li className="flex justify-center py-8">
            <p className="text-sm text-stone-400">
              No messages yet — say hello!
            </p>
          </li>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.senderId === currentUserId;
          const msgDate = formatDate(msg.sentAt);
          const showDate = msgDate !== lastDate;
          lastDate = msgDate;

          const prevMsg = messages[i - 1];
          const isFirstInCluster =
            i === 0 ||
            prevMsg.senderId !== msg.senderId ||
            new Date(msg.sentAt).getTime() - new Date(prevMsg.sentAt).getTime() > 120_000;

          return (
            <li key={msg.id} className="list-none">
              {/* Date separator */}
              {showDate && (
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-stone-200" />
                  <span className="text-[11px] text-stone-400 font-medium">{msgDate}</span>
                  <div className="flex-1 h-px bg-stone-200" />
                </div>
              )}

              <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} ${isFirstInCluster ? "mt-3" : "mt-0.5"}`}>
                {/* Sender name (first in cluster only, other party only) */}
                {isFirstInCluster && !isMe && (
                  <p className="text-[11px] text-stone-400 font-medium mb-1 ml-1">
                    {msg.senderName}
                  </p>
                )}

                <div className={`flex items-end gap-1.5 ${isMe ? "flex-row-reverse" : ""}`}>
                  {/* Bubble */}
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "rounded-br-md text-white"
                        : "rounded-bl-md text-stone-800"
                    }`}
                    style={
                      isMe
                        ? {
                            background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                            boxShadow: "0 2px 8px rgba(180,83,9,0.22)",
                          }
                        : {
                            background: "#FFFFFF",
                            border: "1px solid rgba(0,0,0,0.08)",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                          }
                    }
                  >
                    {msg.body}
                  </div>

                  {/* Timestamp */}
                  <span className="text-[10px] text-stone-400 mb-1 whitespace-nowrap">
                    {formatTime(msg.sentAt)}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Input bar */}
      <div
        className="px-4 py-3 border-t flex-shrink-0"
        style={{ borderColor: "rgba(0,0,0,0.07)", background: "#FFFFFF" }}
      >
        {state?.error && (
          <p className="text-xs text-red-600 mb-2">{state.error}</p>
        )}
        <form ref={formRef} action={formAction} className="flex items-end gap-2">
          <input type="hidden" name="conversationId" value={conversationId} />
          <textarea
            name="body"
            rows={1}
            required
            placeholder="Type a message…"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                (e.currentTarget.form as HTMLFormElement).requestSubmit();
              }
            }}
            className="flex-1 resize-none px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:bg-white transition-all duration-150"
            style={{ maxHeight: "120px" }}
          />
          <button
            type="submit"
            disabled={isPending}
            aria-label="Send message"
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 hover:-translate-y-px"
            style={{
              background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
              boxShadow: "0 2px 8px rgba(180,83,9,0.28)",
            }}
          >
            {isPending ? (
              <Spinner />
            ) : (
              <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 2L9 11M18 2l-6 16-3-7-7-3 16-6z" />
              </svg>
            )}
          </button>
        </form>
        <p className="text-[10px] text-stone-400 mt-1.5 text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
