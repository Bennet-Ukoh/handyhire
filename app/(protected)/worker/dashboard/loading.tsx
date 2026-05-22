function Bone({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-stone-200 ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export default function WorkerDashboardLoading() {
  return (
    <div className="space-y-7" aria-label="Loading dashboard" aria-busy="true">

      {/* Welcome skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-2">
          <Bone className="h-8 w-52" />
          <Bone className="h-4 w-36" />
        </div>
        <Bone className="h-8 w-40 rounded-full" />
      </div>

      {/* Verification section */}
      <div>
        <Bone className="h-3.5 w-36 mb-3 rounded-full" />
        {/* Banner */}
        <Bone className="h-14 w-full mb-4 rounded-xl" />
        {/* Two cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div className="h-1 w-full animate-pulse bg-stone-200" />
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Bone className="w-9 h-9 rounded-xl" />
                <Bone className="h-4 w-32" />
              </div>
              <Bone className="h-6 w-24 rounded-full" />
              <div className="space-y-2">
                <Bone className="h-4 w-full" />
                <Bone className="h-4 w-3/4" />
              </div>
            </div>
          </div>
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div className="h-1 w-full animate-pulse bg-stone-200" />
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Bone className="w-9 h-9 rounded-xl" />
                <Bone className="h-4 w-36" />
              </div>
              <Bone className="h-6 w-28 rounded-full" />
              <div className="space-y-2">
                <Bone className="h-4 w-full" />
                <Bone className="h-4 w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile completeness skeleton */}
      <div>
        <Bone className="h-3.5 w-44 mb-3 rounded-full" />
        <div
          className="bg-white rounded-2xl p-5"
          style={{
            border: "1px solid rgba(0,0,0,0.07)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2">
              <Bone className="h-4 w-36" />
              <Bone className="h-3 w-48" />
            </div>
            <Bone className="h-7 w-12" />
          </div>
          <Bone className="h-2 w-full rounded-full mb-4" />
          <div className="flex flex-wrap gap-2">
            {[52, 64, 44, 72, 56, 60].map((w) => (
              <Bone key={w} className="h-6 rounded-full" style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>

      {/* Stats skeleton */}
      <div>
        <Bone className="h-3.5 w-32 mb-3 rounded-full" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 flex items-center gap-3.5"
              style={{
                border: "1px solid rgba(0,0,0,0.07)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <Bone className="w-10 h-10 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <Bone className="h-6 w-16" />
                <Bone className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs & quotes skeleton */}
      <div>
        <Bone className="h-3.5 w-28 mb-3 rounded-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Job feed skeleton */}
          <div
            className="lg:col-span-2 bg-white rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
            >
              <Bone className="h-4 w-28" />
              <Bone className="h-4 w-16" />
            </div>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="px-5 py-4"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <Bone className="h-4 w-2/3" />
                  <Bone className="h-4 w-20 shrink-0" />
                </div>
                <div className="flex items-center gap-3">
                  <Bone className="h-3 w-24" />
                  <Bone className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>

          {/* Quotes panel skeleton */}
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
            >
              <Bone className="h-4 w-24" />
              <Bone className="h-4 w-14" />
            </div>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="px-5 py-3.5"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <Bone className="h-3.5 flex-1" />
                  <Bone className="h-5 w-16 rounded-full shrink-0" />
                </div>
                <div className="flex items-center justify-between">
                  <Bone className="h-3 w-24" />
                  <Bone className="h-4 w-14" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
