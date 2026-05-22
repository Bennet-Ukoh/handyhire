export default function ChatLoading() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col rounded-2xl overflow-hidden bg-white"
      style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      {/* Header skeleton */}
      <div
        className="h-14 shrink-0 flex items-center gap-3 px-5"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div className="w-8 h-8 rounded-full bg-stone-100 animate-pulse" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-32 bg-stone-100 rounded-full animate-pulse" />
          <div className="h-2.5 w-20 bg-stone-100 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Messages skeleton */}
      <div className="flex-1 overflow-hidden px-5 py-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex gap-2 ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
            {i % 2 !== 0 && (
              <div className="w-7 h-7 rounded-full bg-stone-100 animate-pulse shrink-0 mt-1" />
            )}
            <div
              className="h-9 rounded-2xl animate-pulse"
              style={{
                width: `${140 + (i * 30) % 80}px`,
                background: i % 2 === 0 ? "rgba(217,119,6,0.12)" : "rgba(0,0,0,0.05)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Input skeleton */}
      <div
        className="shrink-0 px-4 py-3 flex items-end gap-3"
        style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div className="flex-1 h-10 bg-stone-100 rounded-xl animate-pulse" />
        <div className="w-10 h-10 rounded-xl bg-stone-100 animate-pulse shrink-0" />
      </div>
    </div>
  );
}
