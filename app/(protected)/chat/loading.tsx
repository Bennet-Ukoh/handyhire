function Bone({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-stone-200 ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export default function ChatIndexLoading() {
  return (
    <div
      className="max-w-2xl mx-auto space-y-6"
      aria-busy="true"
      aria-label="Loading messages"
    >
      {/* Header skeleton */}
      <div className="space-y-2">
        <Bone className="h-8 w-36" />
        <Bone className="h-4 w-28 rounded-full" />
      </div>

      {/* List skeleton */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          border: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-4"
            style={{ borderBottom: i < 3 ? "1px solid rgba(0,0,0,0.06)" : undefined }}
          >
            <Bone className="w-11 h-11 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Bone className="h-3.5 w-32" />
                <Bone className="h-3 w-12 rounded-full" />
              </div>
              <Bone className="h-2.5 w-44 rounded-full" />
              <div className="flex items-center justify-between gap-2">
                <Bone className="h-2.5 w-56 rounded-full" />
                {i === 0 && <Bone className="h-4 w-5 rounded-full shrink-0" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
