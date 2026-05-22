import type { ClientStats } from "@/lib/client/types";

function formatNgn(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}k`;
  return `₦${amount.toLocaleString()}`;
}

interface StatCardProps {
  value: string;
  label: string;
  sub?: string;
  icon: React.ReactNode;
}

function StatCard({ value, label, sub, icon }: StatCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-4 flex items-center gap-3.5"
      style={{
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "rgba(217,119,6,0.07)" }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold text-stone-900 leading-none tabular-nums">
          {value}
        </p>
        <p className="text-xs text-stone-500 mt-1">{label}</p>
        {sub && <p className="text-[10px] text-stone-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

interface Props {
  stats: ClientStats;
}

export default function ClientStatsRow({ stats }: Props) {
  const ratingDisplay =
    stats.averageRatingGiven > 0
      ? `${stats.averageRatingGiven.toFixed(1)}★`
      : "—";

  const items: StatCardProps[] = [
    {
      value: String(stats.jobsPosted),
      label: "Jobs posted",
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-amber-600" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="7" width="16" height="11" rx="2" />
          <path d="M7 7V5a3 3 0 0 1 6 0v2" />
          <path d="M10 12v2" />
        </svg>
      ),
    },
    {
      value: String(stats.workersHired),
      label: "Workers hired",
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-amber-600" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="7.5" cy="6.5" r="2.5" />
          <path d="M2 17c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
          <circle cx="14" cy="7" r="2" />
          <path d="M16.5 17c0-2-1.5-3.5-4-4" />
        </svg>
      ),
    },
    {
      value: formatNgn(stats.totalSpentNgn),
      label: "Total spent",
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-amber-600" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="10" cy="10" r="8" />
          <path d="M10 6v8M7.5 8.5C7.5 7.4 8.6 7 10 7s2.5.7 2.5 1.8-1.2 1.5-2.5 1.7-2.5.7-2.5 2S8.8 14 10 14s2.5-.5 2.5-1.5" />
        </svg>
      ),
    },
    {
      value: ratingDisplay,
      label: "Avg rating given",
      sub: stats.jobsPosted > 0 ? `across ${stats.jobsPosted} jobs` : undefined,
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber-500" aria-hidden="true">
          <path d="M10 1l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 13.4l-4.8 2.5.9-5.4L2.2 6.7l5.4-.8L10 1z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  );
}
