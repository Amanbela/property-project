import Link from "next/link";
import { TrendingUp, Shield, Users, MapPin, ArrowRight } from "lucide-react";
import type { AreaDoc } from "@/features/colony-intelligence/services/area-service";

interface Props {
  area: AreaDoc;
  badge?: string;
  badgeColor?: string;
}

export function HomepageAreaCard({ area, badge, badgeColor = "bg-brand-500" }: Props) {
  return (
    <Link
      href={`/areas/${area.slug}`}
      className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={area.featuredImage || "https://images.unsplash.com/photo-1560518883-ce09059eeffa"}
          alt={area.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {badge && (
          <span className={`absolute left-3 top-3 rounded-full ${badgeColor} px-3 py-1 text-[10px] font-bold text-white shadow-sm`}>
            {badge}
          </span>
        )}
        {/* Score Badge */}
        <div className="absolute bottom-3 right-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-center shadow-sm">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Score</p>
          <p className="text-sm font-bold text-brand-600">{area.investmentScore}</p>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-slate-600 shadow-sm">
          <MapPin size={10} />
          Indore
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
          {area.name}
        </h3>
        <p className="mt-1 text-sm text-slate-500 line-clamp-2 leading-relaxed">{area.description}</p>

        {/* Scores */}
        <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs">
          <div className="flex items-center gap-1">
            <TrendingUp size={13} className="text-brand-500" />
            <span className="font-semibold text-slate-700">{area.investmentScore}</span>
            <span className="text-slate-400">/100</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield size={13} className="text-trust-500" />
            <span className="font-semibold text-slate-700">{area.familyScore}</span>
            <span className="text-slate-400">/100</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={13} className="text-purple-500" />
            <span className="font-semibold text-slate-700">{area.futureGrowth}</span>
            <span className="text-slate-400">/100</span>
          </div>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5">
          <span className="text-xs text-slate-500">Avg Price</span>
          <span className="text-sm font-bold text-slate-800">
            ₹{area.averagePrice.toLocaleString()}<span className="text-[10px] font-normal text-slate-400">/sq.ft</span>
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-medium text-brand-600 group-hover:underline">
            Explore Area Intelligence
          </span>
          <ArrowRight size={14} className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-brand-500" />
        </div>
      </div>
    </Link>
  );
}
