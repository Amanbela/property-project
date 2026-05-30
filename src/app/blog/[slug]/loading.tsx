import { ArrowLeft } from "lucide-react";

export default function BlogDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse space-y-8">
      {/* Breadcrumb */}
      <div className="h-4 w-48 rounded bg-slate-100" />

      {/* Hero skeleton */}
      <div className="overflow-hidden rounded-3xl bg-white border border-slate-100">
        <div className="h-56 md:h-72 bg-slate-100" />
        <div className="px-6 pb-8 pt-6 space-y-4">
          <div className="flex gap-3">
            <div className="h-5 w-20 rounded-full bg-slate-100" />
            <div className="h-5 w-24 rounded bg-slate-100" />
          </div>
          <div className="h-8 w-3/4 rounded-lg bg-slate-100" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-5/6 rounded bg-slate-100" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-10 space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`h-4 rounded bg-slate-100 ${i % 3 === 0 ? "w-3/4" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}
