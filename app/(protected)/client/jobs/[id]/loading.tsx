export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="h-4 w-32 rounded-lg bg-stone-100 animate-pulse" />
      <div className="bg-white rounded-2xl p-6 space-y-4" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
        <div className="flex justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-4 w-20 rounded-full bg-stone-100 animate-pulse" />
            <div className="h-7 w-3/4 rounded-xl bg-stone-100 animate-pulse" />
          </div>
          <div className="h-7 w-20 rounded-lg bg-stone-100 animate-pulse" />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[1,2,3,4].map((i) => <div key={i} className="h-14 rounded-xl bg-stone-100 animate-pulse" />)}
        </div>
        <div className="h-20 rounded-xl bg-stone-100 animate-pulse" />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-36 rounded-lg bg-stone-100 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3].map((i) => <div key={i} className="h-48 rounded-2xl bg-stone-100 animate-pulse" />)}
        </div>
      </div>
    </div>
  );
}
