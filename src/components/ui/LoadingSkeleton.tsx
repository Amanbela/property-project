export function LoadingSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-lg bg-slate-100"
          style={{ width: `${85 - i * 15}%` }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card-base animate-pulse">
      <div className="mb-4 flex items-start justify-between">
        <div className="h-5 w-2/3 rounded-lg bg-slate-100" />
        <div className="h-6 w-16 rounded-full bg-slate-100" />
      </div>
      <div className="space-y-2">
        <div className="h-3.5 w-full rounded bg-slate-100" />
        <div className="h-3.5 w-4/5 rounded bg-slate-100" />
      </div>
      <div className="mt-5 flex gap-3">
        {[80, 80, 80].map((w, i) => (
          <div key={i} className="h-16 w-16 rounded-full bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
