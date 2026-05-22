function Shimmer({ className }: { className: string }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className}`}
      style={{ background: "rgba(0,0,0,0.06)" }}
    />
  );
}

function StepSkeleton() {
  return (
    <div
      className="bg-white rounded-2xl p-6 space-y-5"
      style={{
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-start gap-4">
        <Shimmer className="w-8 h-8 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-4 w-40" />
          <Shimmer className="h-3 w-64" />
        </div>
      </div>
      <Shimmer className="h-11 w-full rounded-xl" />
      <Shimmer className="h-3 w-48" />
      <Shimmer className="h-10 w-32 rounded-xl" />
    </div>
  );
}

export default function VerificationLoading() {
  return (
    <div className="max-w-2xl space-y-6">
      <Shimmer className="h-4 w-32" />
      <div className="space-y-2">
        <Shimmer className="h-8 w-64" />
        <Shimmer className="h-4 w-72" />
      </div>
      <Shimmer className="h-14 w-full rounded-xl" />
      <StepSkeleton />
      <StepSkeleton />
    </div>
  );
}
