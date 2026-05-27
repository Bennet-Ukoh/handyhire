export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-8 w-36 rounded-xl bg-stone-100 animate-pulse" />
          <div className="h-4 w-56 rounded-lg bg-stone-100 animate-pulse" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-stone-100 animate-pulse" />
      </div>
      <div className="h-9 w-72 rounded-xl bg-stone-100 animate-pulse" />
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-5 space-y-3"
          style={{ border: "1px solid rgba(0,0,0,0.07)" }}
        >
          <div className="flex justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-20 rounded-full bg-stone-100 animate-pulse" />
              <div className="h-5 w-3/4 rounded-lg bg-stone-100 animate-pulse" />
              <div className="h-4 w-1/2 rounded-lg bg-stone-100 animate-pulse" />
            </div>
            <div className="h-6 w-20 rounded-lg bg-stone-100 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
