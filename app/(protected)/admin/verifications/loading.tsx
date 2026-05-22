function Shimmer({ className }: { className: string }) {
  return (
    <div className={`rounded-lg animate-pulse ${className}`} style={{ background: "rgba(0,0,0,0.06)" }} />
  );
}

const TAB_WIDTHS = ["w-10", "w-14", "w-20", "w-24", "w-16", "w-16"];

export default function VerificationsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Shimmer className="h-8 w-56" />
        <Shimmer className="h-4 w-72" />
      </div>
      <div className="flex gap-2">
        {TAB_WIDTHS.map((w, i) => (
          <Shimmer key={i} className={`h-8 rounded-xl ${w}`} />
        ))}
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4"
            style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
            <Shimmer className="w-10 h-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Shimmer className="h-4 w-40" />
              <Shimmer className="h-3 w-28" />
            </div>
            <div className="hidden sm:flex gap-6">
              <Shimmer className="h-4 w-16" />
              <Shimmer className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
