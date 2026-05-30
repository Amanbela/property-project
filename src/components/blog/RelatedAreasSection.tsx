import Link from "next/link";
import { TrendingUp, Users, MapPin, ArrowRight } from "lucide-react";
import type { AreaDoc } from "@/features/colony-intelligence/services/area-service";

interface Props {
  areas: AreaDoc[];
}

export function RelatedAreasSection({ areas }: Props) {
  if (areas.length === 0) return null;

  return (
    <section>
      <h2 className="heading-md mb-2 text-slate-900">Recommended Areas for You</h2>
      <p className="mb-6 text-sm text-slate-500">Explore top-rated areas based on investment potential</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => (
          <Link
            key={area.slug}
            href={`/areas/${area.slug}`}
            className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-brand-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="badge-slate flex items-center gap-1 mb-1 text-xs">
                  <MapPin size={10} /> Indore
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {area.name}
                </h3>
              </div>
              <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-bold text-brand-600">
                Score {area.investmentScore}
              </span>
            </div>

            <p className="text-sm text-slate-500 line-clamp-2 mb-3">{area.description}</p>

            <div className="flex items-center gap-3 border-t border-slate-100 pt-3 text-xs">
              <span className="flex items-center gap-1 font-medium text-slate-600">
                <TrendingUp size={13} className="text-brand-500" />
                {area.investmentScore}/100
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-600">
                <Users size={13} className="text-purple-500" />
                {area.futureGrowth}/100
              </span>
              <span className="ml-auto text-slate-400">
                ₹{area.averagePrice.toLocaleString()}/sq.ft
              </span>
            </div>

            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
              View Area Intelligence <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
