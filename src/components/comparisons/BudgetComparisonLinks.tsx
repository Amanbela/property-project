import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";

interface ComparisonLink {
  slug: string;
  heroHeading?: string;
  introText?: string;
  area1: string | Record<string, unknown>;
  area2: string | Record<string, unknown>;
}

interface Props {
  comparisons: ComparisonLink[];
}

export function BudgetComparisonLinks({ comparisons }: Props) {
  if (comparisons.length === 0) return null;

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100">
          <BarChart3 size={20} className="text-brand-600" />
        </span>
        <div>
          <h2 className="heading-md text-slate-900">Compare Your Options</h2>
          <p className="text-sm text-slate-500">
            Side-by-side comparisons of these recommended areas
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {comparisons.map((cmp) => {
          const a1 = cmp.area1 as { name: string; slug: string } | null;
          const a2 = cmp.area2 as { name: string; slug: string } | null;
          if (!a1 || !a2) return null;

          return (
            <Link
              key={cmp.slug}
              href={`/areas/compare/${cmp.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-brand-200 hover:shadow-md"
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {a1.name} vs {a2.name}
                </h3>
                <ArrowRight size={16} className="mt-1 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-500" />
              </div>
              {cmp.heroHeading ? (
                <p className="mb-3 text-sm text-slate-500 line-clamp-2">{cmp.heroHeading}</p>
              ) : (
                <p className="mb-3 text-sm text-slate-400 line-clamp-2">
                  Compare {a1.name} and {a2.name} — pricing, scores, and livability.
                </p>
              )}
              <div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{a1.name}</span>
                <span className="text-slate-300">vs</span>
                <span className="font-semibold text-slate-700">{a2.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mt-6 text-center">
        <Link
          href="/areas/compare"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          View all comparisons <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
