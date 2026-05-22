function Shimmer({ className }: { className: string }) {
  return (
    <div className={`rounded-lg animate-pulse ${className}`} style={{ background: "rgba(0,0,0,0.06)" }} />
  );
}

export default function WorkerVerificationDetailLoading() {
  return (
    <div className="max-w-3xl space-y-6">
      <Shimmer className="h-4 w-28" />
      <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
        <div className="flex items-start gap-4">
          <Shimmer className="w-14 h-14 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Shimmer className="h-6 w-48" />
            <Shimmer className="h-4 w-40" />
            <div className="flex gap-2 mt-2">
              <Shimmer className="h-6 w-20 rounded-full" />
              <Shimmer className="h-6 w-28 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 space-y-5" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
            <div className="flex justify-between">
              <Shimmer className="h-4 w-28" />
              <Shimmer className="h-6 w-20 rounded-full" />
            </div>
            <div className="space-y-3">
              <Shimmer className="h-3 w-full" />
              <Shimmer className="h-3 w-3/4" />
            </div>
            <div className="flex gap-2">
              <Shimmer className="h-9 w-28 rounded-xl" />
              <Shimmer className="h-9 w-24 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Shimmer className="h-3 w-24" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl px-4 py-3.5 flex gap-3" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
            <Shimmer className="w-2 h-2 rounded-full shrink-0 mt-1.5" />
            <div className="flex-1 space-y-1.5">
              <Shimmer className="h-4 w-40" />
              <Shimmer className="h-3 w-28" />
            </div>
            <Shimmer className="h-3 w-20 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
