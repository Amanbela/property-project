export function AreaDetailSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      {/* Hero Skeleton */}
      <div className="h-72 rounded-3xl bg-slate-800" />

      {/* Why Recommended Skeleton */}
      <div className="h-40 rounded-2xl bg-slate-100" />

      {/* Intelligence Skeleton */}
      <div>
        <div className="mb-6 h-6 w-64 rounded-lg bg-slate-100" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 rounded bg-slate-100" />
                <div className="h-3 w-full rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
          <div className="space-y-5">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 rounded bg-slate-100" />
                <div className="h-3 w-full rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Colonies Skeleton */}
      <div>
        <div className="mb-6 h-6 w-64 rounded-lg bg-slate-100" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>

      {/* Lead Form Skeleton */}
      <div className="h-80 rounded-2xl bg-slate-100" />
    </div>
  );
}
