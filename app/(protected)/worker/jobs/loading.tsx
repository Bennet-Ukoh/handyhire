export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-xl bg-stone-100 animate-pulse" />
        <div className="h-4 w-72 rounded-lg bg-stone-100 animate-pulse" />
      </div>
      {/* Job card skeletons */}
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-5 space-y-3"
          style={{ border: "1px solid rgba(0,0,0,0.07)" }}
        >
          <div className="flex justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-3 w-16 rounded bg-stone-100 animate-pulse" />
              <div className="h-5 w-3/4 rounded-lg bg-stone-100 animate-pulse" />
              <div className="h-4 w-full rounded-lg bg-stone-100 animate-pulse" />
              <div className="h-4 w-2/3 rounded-lg bg-stone-100 animate-pulse" />
            </div>
            <div className="shrink-0 space-y-2 items-end flex flex-col">
              <div className="h-5 w-20 rounded-lg bg-stone-100 animate-pulse" />
              <div className="h-9 w-20 rounded-xl bg-stone-100 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
