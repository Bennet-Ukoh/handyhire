import type { WorkerStats } from "@/lib/worker/types";

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
        style={{ background: "rgba(217,119,6,0.08)" }}
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
  stats: WorkerStats;
}

export default function StatsRow({ stats }: Props) {
  const ratingDisplay =
    stats.averageRating > 0
      ? `${stats.averageRating.toFixed(1)}★`
      : "No ratings";

  const items: StatCardProps[] = [
    {
      value: String(stats.jobsCompleted),
      label: "Jobs completed",
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-amber-600" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 4H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
          <rect x="7" y="2" width="6" height="4" rx="1" />
          <path d="M7 11l2 2 4-4" />
        </svg>
      ),
    },
    {
      value: ratingDisplay,
      label: "Average rating",
      sub: stats.reviewCount > 0 ? `${stats.reviewCount} reviews` : undefined,
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber-500" aria-hidden="true">
          <path d="M10 1l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 13.4l-4.8 2.5.9-5.4L2.2 6.7l5.4-.8L10 1z" />
        </svg>
      ),
    },
    {
      value: formatNgn(stats.totalEarningsNgn),
      label: "Total earned",
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-amber-600" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="10" cy="10" r="8" />
          <path d="M10 6v8M7.5 8.5C7.5 7.4 8.6 7 10 7s2.5.7 2.5 1.8-1.2 1.5-2.5 1.7-2.5.7-2.5 2S8.8 14 10 14s2.5-.5 2.5-1.5" />
        </svg>
      ),
    },
    {
      value: `${stats.responseRatePercent}%`,
      label: "Response rate",
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-amber-600" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 3h16v11H2zM6 17h8" />
          <path d="M10 14v3" />
          <path d="M7 9.5l2 2 4-4" />
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
