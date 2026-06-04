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
  currentAreaSlug: string;
  currentAreaName: string;
}

export function AreaComparisonLinks({ comparisons, currentAreaSlug, currentAreaName }: Props) {
  if (comparisons.length === 0) return null;

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100">
          <BarChart3 size={20} className="text-brand-600" />
        </span>
        <div>
          <h2 className="heading-md text-slate-900">Compare {currentAreaName}</h2>
          <p className="text-sm text-slate-500">
            See how {currentAreaName} stacks up against other top areas
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {comparisons.map((cmp) => {
          const a1 = cmp.area1 as { name: string; slug: string };
          const a2 = cmp.area2 as { name: string; slug: string };
          if (!a1 || !a2) return null;

          const other = a1.slug === currentAreaSlug ? a2 : a1;

          return (
            <Link
              key={cmp.slug}
              href={`/areas/compare/${cmp.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-brand-200 hover:shadow-md"
            >
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <span className="badge-slate inline-flex items-center gap-1 mb-1 text-xs">
                    <BarChart3 size={10} className="text-slate-400" /> vs
                  </span>
                  <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {currentAreaName} vs {other.name}
                  </h3>
                </div>
                <ArrowRight size={16} className="mt-1 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-500" />
              </div>
              {cmp.heroHeading ? (
                <p className="mb-3 text-sm text-slate-500 line-clamp-2">{cmp.heroHeading}</p>
              ) : (
                <p className="mb-3 text-sm text-slate-400 line-clamp-2">
                  Compare {currentAreaName} and {other.name} — pricing, scores, and livability.
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
    </section>
  );
}
