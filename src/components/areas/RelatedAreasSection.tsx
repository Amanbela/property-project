import Link from "next/link";
import { ArrowRight, TrendingUp, MapPin } from "lucide-react";
import type { AreaDoc } from "@/features/colony-intelligence/services/area-service";

interface RelatedAreasSectionProps {
  areas: AreaDoc[];
  currentSlug: string;
}

export function RelatedAreasSection({ areas, currentSlug }: RelatedAreasSectionProps) {
  const filtered = areas.filter((a) => a.slug !== currentSlug).slice(0, 3);

  if (filtered.length === 0) return null;

  return (
    <section>
      <h2 className="heading-md mb-2 text-slate-900">People Also Explore</h2>
      <p className="mb-6 text-sm text-slate-500">Similar areas and nearby recommendations</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((area) => (
          <Link
            key={area.slug}
            href={`/areas/${area.slug}`}
            className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-brand-200 hover:shadow-md"
          >
            <div className="mb-2 flex items-start justify-between">
              <div>
                <span className="badge-slate flex items-center gap-1 mb-1 text-xs">
                  <MapPin size={10} className="text-slate-400" /> Indore
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {area.name}
                </h3>
              </div>
              <ArrowRight size={16} className="mt-1 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-500" />
            </div>
            <p className="mb-3 text-sm text-slate-500 line-clamp-2">{area.description}</p>
            <div className="flex items-center gap-3 border-t border-slate-100 pt-3 text-xs">
              <span className="flex items-center gap-1 font-medium text-slate-600">
                <TrendingUp size={13} className="text-brand-500" />
                {area.investmentScore}/100
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">₹{area.averagePrice.toLocaleString()}/sq.ft</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
