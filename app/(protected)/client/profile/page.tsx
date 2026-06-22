import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/auth/service";
import { getClientProfile } from "@/lib/client/service";

export const metadata: Metadata = { title: "My Profile — HandyHire" };

function formatNgn(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}k`;
  return `₦${amount.toLocaleString()}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
}

export default async function ClientProfilePage() {
  const session = await getSession();
  const [user, profile] = await Promise.all([
    getUserById(session!.userId),
    getClientProfile(session!.userId),
  ]);

  if (!user) return null;

  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const fields = [
    { label: "Full name",    value: user.name },
    { label: "Email",        value: user.email },
    { label: "Location",     value: profile.location ?? "Not set" },
    { label: "Phone",        value: profile.phone ?? "Not set" },
    { label: "Member since", value: formatDate(user.createdAt) },
  ];

  const stats = [
    { label: "Jobs Posted",    value: String(profile.stats.jobsPosted) },
    { label: "Workers Hired",  value: String(profile.stats.workersHired) },
    { label: "Total Spent",    value: formatNgn(profile.stats.totalSpentNgn) },
    { label: "Avg Rating",     value: profile.stats.averageRatingGiven > 0 ? `${profile.stats.averageRatingGiven.toFixed(1)} ★` : "—" },
  ];

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-stone-900 leading-tight">My Profile</h1>
        <p className="text-sm text-stone-500 mt-1">Your HandyHire client profile.</p>
      </div>

      {/* Identity card */}
      <div
        className="bg-white rounded-2xl p-6"
        style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center text-lg font-bold text-white"
            style={{ background: "linear-gradient(135deg, #1c1917 0%, #44403c 100%)" }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-stone-900">{user.name}</h2>
            {user.location && (
              <p className="text-sm text-stone-500 mt-0.5">{user.location}</p>
            )}
            <p className="text-xs text-stone-400 mt-1">Client · HandyHire</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-4 text-center"
            style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">{label}</p>
            <p className="font-display text-xl font-bold text-stone-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Account details */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      >
        <div className="px-5 py-4 flex items-center justify-between gap-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <div>
            <h3 className="text-sm font-semibold text-stone-800">Account details</h3>
            <p className="text-xs text-stone-400 mt-0.5">Your contact and location information.</p>
          </div>
          <a
            href="/client/profile/setup"
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors shrink-0"
          >
            Edit profile
          </a>
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

      <div className="flex flex-wrap gap-3">
        <Link
          href="/client/jobs"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-px"
          style={{ background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)", boxShadow: "0 2px 8px rgba(180,83,9,0.24)" }}
        >
          View my jobs
        </Link>
        <Link
          href="/client/post-job"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-stone-50"
          style={{ borderColor: "rgba(0,0,0,0.1)", color: "#1c1917" }}
        >
          Post a job
        </Link>
      </div>
    </div>
  );
}
