import { ThumbsUp, ThumbsDown } from "lucide-react";

interface ProsConsSectionProps {
  pros: string[];
  cons: string[];
}

export function ProsConsSection({ pros, cons }: ProsConsSectionProps) {
  return (
    <section>
      <h2 className="heading-md mb-6 text-slate-900">Pros & Cons Overview</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
              <ThumbsUp size={16} className="text-emerald-600" />
            </span>
            <h3 className="font-display text-lg font-bold text-emerald-900">Advantages</h3>
          </div>
          {pros.length > 0 ? (
            <ul className="space-y-3">
              {pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <span className="text-xs font-bold text-emerald-600">✓</span>
                  </span>
                  <span className="text-sm text-slate-700">{pro}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">No advantages listed yet.</p>
          )}
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
              <ThumbsDown size={16} className="text-red-600" />
            </span>
            <h3 className="font-display text-lg font-bold text-red-900">Drawbacks</h3>
          </div>
          {cons.length > 0 ? (
            <ul className="space-y-3">
              {cons.map((con, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <span className="text-xs font-bold text-red-600">✗</span>
                  </span>
                  <span className="text-sm text-slate-700">{con}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">No drawbacks listed yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
