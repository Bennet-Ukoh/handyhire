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

export default function ClientDashboardLoading() {
  return (
    <div className="space-y-7" aria-label="Loading dashboard" aria-busy="true">

      {/* Welcome skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Bone className="h-8 w-52" />
          <Bone className="h-4 w-28" />
        </div>
        <Bone className="h-10 w-32 rounded-xl self-start sm:self-auto shrink-0" />
      </div>

      {/* Stats skeleton */}
      <div>
        <Bone className="h-3.5 w-28 mb-3 rounded-full" />
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
                <Bone className="h-6 w-14" />
                <Bone className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Received quotes skeleton */}
      <div>
        <Bone className="h-3.5 w-36 mb-3 rounded-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(0,0,0,0.07)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              {/* Job context bar */}
              <div
                className="px-4 py-2.5"
                style={{ background: "rgba(0,0,0,0.025)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
              >
                <Bone className="h-3 w-40" />
              </div>

              <div className="p-4 space-y-4">
                {/* Worker identity */}
                <div className="flex items-start gap-3">
                  <Bone className="w-10 h-10 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Bone className="h-4 w-32" />
                    <Bone className="h-3 w-24" />
                  </div>
                </div>

                {/* Note */}
                <div className="space-y-1.5">
                  <Bone className="h-3 w-full" />
                  <Bone className="h-3 w-5/6" />
                  <Bone className="h-3 w-2/3" />
                </div>

                {/* Amount */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <Bone className="h-3 w-12" />
                    <Bone className="h-6 w-20" />
                  </div>
                  <Bone className="h-3 w-14" />
                </div>

                {/* Buttons */}
                <div
                  className="flex gap-2 pt-1"
                  style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <Bone className="h-10 flex-1 rounded-xl" />
                  <Bone className="h-10 flex-1 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs panel skeleton */}
      <div>
        <Bone className="h-3.5 w-24 mb-3 rounded-full" />
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
              className="px-5 py-4"
              style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <div className="flex gap-2">
                    <Bone className="h-5 w-16 rounded-full" />
                  </div>
                  <Bone className="h-4 w-3/4" />
                  <div className="flex gap-3">
                    <Bone className="h-3 w-24" />
                    <Bone className="h-3 w-16" />
                  </div>
                </div>
                <div className="space-y-1.5 shrink-0 text-right">
                  <Bone className="h-4 w-20" />
                  <Bone className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
