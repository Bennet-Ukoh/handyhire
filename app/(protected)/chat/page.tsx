import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getConversationPreviews } from "@/lib/chat/service";
import type { ConversationPreview } from "@/lib/chat/types";

export const metadata: Metadata = { title: "Messages — HandyHire" };

/* ── Helpers ────────────────────────────────────────────────────────── */

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (days > 6)  return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });
  if (days > 0)  return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0)  return `${mins}m ago`;
  return "Just now";
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* ── Conversation list item ─────────────────────────────────────────── */

interface ItemProps {
  preview: ConversationPreview;
  currentUserId: string;
}

function ConversationItem({ preview, currentUserId }: ItemProps) {
  const otherName =
    currentUserId === preview.clientId ? preview.workerName : preview.clientName;
  const ini = initials(otherName);
  const hasUnread = preview.unreadCount > 0;
  const timestamp = preview.lastMessageAt ?? preview.createdAt;

  return (
    <li>
      <Link
        href={`/chat/${preview.id}`}
        className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50/70 transition-colors duration-100"
      >
        {/* Avatar */}
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-amber-800 shrink-0"
          style={{ background: "linear-gradient(135deg, #fef3c7, #fcd34d)" }}
          aria-hidden="true"
        >
          {ini}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p
              className="text-sm leading-tight truncate"
              style={{ fontWeight: hasUnread ? 700 : 500, color: "#1c1917" }}
            >
              {otherName}
            </p>
            <span
              className="text-[11px] shrink-0 tabular-nums"
              style={{
                color: hasUnread ? "#d97706" : "#a8a29e",
                fontWeight: hasUnread ? 600 : 400,
              }}
            >
              {formatRelativeTime(timestamp)}
            </span>
          </div>

          <p className="text-[11px] text-stone-400 truncate mb-0.5">{preview.jobTitle}</p>

          <div className="flex items-center justify-between gap-2">
            <p
              className="text-xs truncate"
              style={{
                color: hasUnread ? "#57534e" : "#a8a29e",
                fontWeight: hasUnread ? 500 : 400,
              }}
            >
              {preview.lastMessageSnippet ?? "No messages yet — say hello!"}
            </p>
            {hasUnread && (
              <span
                className="shrink-0 text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center leading-none"
                style={{ background: "#d97706", color: "#fff" }}
                aria-label={`${preview.unreadCount} unread`}
              >
                {preview.unreadCount > 99 ? "99+" : preview.unreadCount}
              </span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}

/* ── Empty state ────────────────────────────────────────────────────── */

function EmptyState({ role }: { role: "client" | "worker" }) {
  return (
    <div
      className="bg-white rounded-2xl py-14 px-8 flex flex-col items-center text-center"
      style={{
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "rgba(217,119,6,0.07)" }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-7 h-7"
          stroke="#d97706"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <h2 className="font-display text-xl text-stone-800 mb-2">No conversations yet</h2>
      <p className="text-sm text-stone-500 max-w-[32ch] leading-relaxed">
        {role === "worker"
          ? "Clients will message you once they accept your quote."
          : "Accept a worker's quote to start chatting."}
      </p>
      <Link
        href={role === "worker" ? "/worker/jobs" : "/client/dashboard"}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all duration-150 hover:-translate-y-px"
        style={{
          background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
          boxShadow: "0 2px 8px rgba(180,83,9,0.25)",
        }}
      >
        {role === "worker" ? "Browse jobs" : "View your quotes"}
      </Link>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */

export default async function ChatIndexPage() {
  const session = await getSession();
  if (!session) redirect("/auth/signin");
  if (session.role === "admin") redirect("/admin/dashboard");

  const role = session.role as "client" | "worker";
  const previews = await getConversationPreviews(session.userId, role);
  const totalUnread = previews.reduce((sum, p) => sum + p.unreadCount, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-stone-900 leading-tight">
          Messages
        </h1>
        {previews.length > 0 && (
          <p className="text-sm text-stone-500 mt-1">
            {totalUnread > 0
              ? `${totalUnread} unread ${totalUnread === 1 ? "conversation" : "conversations"}`
              : `${previews.length} ${previews.length === 1 ? "conversation" : "conversations"}`}
          </p>
        )}
      </div>

      {/* List or empty */}
      {previews.length === 0 ? (
        <EmptyState role={role} />
      ) : (
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{
            border: "1px solid rgba(0,0,0,0.07)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <ul
            className="divide-y"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
            aria-label="Conversations"
          >
            {previews.map((preview) => (
              <ConversationItem
                key={preview.id}
                preview={preview}
                currentUserId={session.userId}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
