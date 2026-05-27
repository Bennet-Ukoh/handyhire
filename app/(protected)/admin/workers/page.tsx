import type { Metadata } from "next";
import Link from "next/link";
import { findAllByRole } from "@/lib/auth/mock-store";
import { getVerification } from "@/lib/worker/verification-store";
import { deriveOverallStatus } from "@/lib/worker/types";
import type { OverallVerificationStatus } from "@/lib/worker/types";

export const metadata: Metadata = { title: "Workers — HandyHire Admin" };

const STATUS_CONFIG: Record<OverallVerificationStatus, { label: string; bg: string; text: string; dot: string }> = {
  incomplete:  { label: "Not started", bg: "rgba(120,113,108,0.08)", text: "#78716c", dot: "#a8a29e" },
  in_progress: { label: "In review",   bg: "rgba(59,130,246,0.08)",  text: "#1d4ed8", dot: "#3b82f6" },
  verified:    { label: "Verified",    bg: "rgba(16,185,129,0.08)",  text: "#065f46", dot: "#10b981" },
  rejected:    { label: "Rejected",    bg: "rgba(239,68,68,0.08)",   text: "#b91c1c", dot: "#ef4444" },
};

type TabFilter = "all" | "verified" | "in_progress" | "rejected";
const TABS: { key: TabFilter; label: string }[] = [
  { key: "all",         label: "All" },
  { key: "verified",    label: "Verified" },
  { key: "in_progress", label: "In Review" },
  { key: "rejected",    label: "Rejected" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function AdminWorkersPage({ searchParams }: Props) {
  const { tab: rawTab } = await searchParams;
  const tab = (["all", "verified", "in_progress", "rejected"].includes(rawTab ?? "") ? rawTab : "all") as TabFilter;

  const workers = findAllByRole("worker").map((w) => {
    const verification = getVerification(w.id);
    const overall = deriveOverallStatus(verification);
    return { ...w, overall };
  });

  const filtered = tab === "all" ? workers : workers.filter((w) => w.overall === tab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-stone-900 leading-tight">Workers</h1>
        <p className="text-sm text-stone-500 mt-1">
          All registered workers and their verification status.
        </p>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}
        role="tablist"
      >
        {TABS.map(({ key, label }) => {
          const count = key === "all" ? workers.length : workers.filter((w) => w.overall === key).length;
          return (
            <Link
              key={key}
              href={`/admin/workers?tab=${key}`}
              role="tab"
              aria-selected={tab === key}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
              style={
                tab === key
                  ? { background: "#fff", color: "#1c1917", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }
                  : { color: "#78716c" }
              }
            >
              {label}
              {count > 0 && <span className="ml-1.5 text-[10px] tabular-nums opacity-60">{count}</span>}
            </Link>
          );
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-12 text-center"
          style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          <p className="font-semibold text-stone-600 mb-1">No workers in this view</p>
          <p className="text-sm text-stone-400">
            {tab === "all" ? "No workers have registered yet." : `No workers with status "${tab.replace("_", " ")}".`}
          </p>
        </div>
      ) : (
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          <ul className="divide-y" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
            {filtered.map((worker) => {
              const cfg = STATUS_CONFIG[worker.overall];
              const initials = worker.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

              return (
                <li
                  key={worker.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50/60 transition-colors duration-100 group"
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-sm font-bold text-amber-800"
                    style={{ background: "linear-gradient(135deg, #fef3c7, #fcd34d)" }}
                    aria-hidden="true"
                  >
                    {initials}
                  </div>

                  {/* Identity */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-stone-800">{worker.name}</span>
                      <span
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                        style={{ background: cfg.bg, color: cfg.text }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-xs text-stone-400">
                      {worker.trade && <span>{worker.trade}</span>}
                      {worker.trade && worker.location && <span>·</span>}
                      {worker.location && <span>{worker.location}</span>}
                      <span>·</span>
                      <span>Joined {formatDate(worker.createdAt)}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    href={`/admin/verifications/${worker.id}`}
                    className="shrink-0 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Review ${worker.name}`}
                  >
                    Review
                    <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M2 6h8M6 2l4 4-4 4" />
                    </svg>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
