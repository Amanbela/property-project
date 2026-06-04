export function ComparisonDetailSkeleton() {
  return (
    <div className="space-y-12 md:space-y-16 animate-pulse">
      {/* Hero skeleton */}
      <div className="rounded-3xl bg-slate-200 p-10 md:p-16">
        <div className="h-10 w-3/4 rounded-lg bg-slate-300" />
        <div className="mt-4 h-5 w-1/2 rounded-lg bg-slate-300" />
        <div className="mt-6 flex gap-4">
          <div className="h-10 w-32 rounded-full bg-slate-300" />
          <div className="h-10 w-10 rounded-full bg-slate-300" />
          <div className="h-10 w-32 rounded-full bg-slate-300" />
        </div>
      </div>

      {/* Score comparison skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="mb-6 h-7 w-48 rounded-lg bg-slate-200" />
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-2">
                <div className="h-20 w-20 rounded-full bg-slate-200" />
                <div className="h-4 w-24 rounded bg-slate-200" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-2">
                <div className="h-20 w-20 rounded-full bg-slate-200" />
                <div className="h-4 w-24 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key differences skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="mb-6 h-7 w-48 rounded-lg bg-slate-200" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="grid grid-cols-3 gap-4">
              <div className="h-5 rounded bg-slate-200" />
              <div className="h-5 rounded bg-slate-200" />
              <div className="h-5 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
