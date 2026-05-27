import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/auth/service";
import { getVerification } from "@/lib/worker/verification-store";
import { deriveOverallStatus } from "@/lib/worker/types";

export const metadata: Metadata = { title: "My Profile — HandyHire" };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
}

const OVERALL_STATUS = {
  incomplete:  { label: "Incomplete",  bg: "rgba(120,113,108,0.08)", text: "#78716c", dot: "#a8a29e" },
  in_progress: { label: "In review",   bg: "rgba(59,130,246,0.08)",  text: "#1d4ed8", dot: "#3b82f6" },
  verified:    { label: "Verified",    bg: "rgba(16,185,129,0.08)",  text: "#065f46", dot: "#10b981" },
  rejected:    { label: "Action needed", bg: "rgba(239,68,68,0.08)", text: "#b91c1c", dot: "#ef4444" },
} as const;

export default async function WorkerProfilePage() {
  const session = await getSession();
  const [user, verification] = await Promise.all([
    getUserById(session!.userId),
    Promise.resolve(getVerification(session!.userId)),
  ]);

  if (!user) return null;

  const overall = deriveOverallStatus(verification);
  const statusCfg = OVERALL_STATUS[overall];
  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const fields = [
    { label: "Full name",      value: user.name },
    { label: "Email address",  value: user.email },
    { label: "Primary trade",  value: user.trade ?? "Not set" },
    { label: "Service area",   value: user.location ?? "Not set" },
    { label: "Member since",   value: formatDate(user.createdAt) },
  ];

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-stone-900 leading-tight">My Profile</h1>
        <p className="text-sm text-stone-500 mt-1">Your HandyHire worker profile.</p>
      </div>

      {/* Identity card */}
      <div
        className="bg-white rounded-2xl p-6"
        style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center text-lg font-bold text-white"
            style={{ background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)" }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-bold text-stone-900">{user.name}</h2>
            {user.trade && (
              <p className="text-sm text-stone-500 mt-0.5">{user.trade} · {user.location ?? "Location not set"}</p>
            )}
            {/* Verification badge */}
            <div className="mt-2">
              <Link
                href="/worker/verification"
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full transition-opacity hover:opacity-80"
                style={{ background: statusCfg.bg, color: statusCfg.text }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusCfg.dot }} />
                Verification: {statusCfg.label}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Profile fields */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      >
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <h3 className="text-sm font-semibold text-stone-800">Account details</h3>
          <p className="text-xs text-stone-400 mt-0.5">Profile editing is coming soon.</p>
        </div>
        <ul className="divide-y" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
          {fields.map(({ label, value }) => (
            <li key={label} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <span className="text-xs font-medium text-stone-400 w-28 shrink-0">{label}</span>
              <span className="text-sm text-stone-800 text-right">{value}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/worker/verification"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-px"
          style={{ background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)", boxShadow: "0 2px 8px rgba(180,83,9,0.24)" }}
        >
          Verification centre
        </Link>
        <Link
          href="/worker/earnings"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-stone-50"
          style={{ borderColor: "rgba(0,0,0,0.1)", color: "#1c1917" }}
        >
          View earnings
        </Link>
      </div>
    </div>
  );
}
