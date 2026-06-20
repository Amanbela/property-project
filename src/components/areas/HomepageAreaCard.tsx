import Link from "next/link";
import { TrendingUp, Shield, Users, MapPin, ArrowRight, BarChart3, Eye, DollarSign } from "lucide-react";
import type { AreaDoc, SectionType } from "@/features/colony-intelligence/services/area-service";

interface Props {
  area: AreaDoc;
  section?: SectionType;
  comparisonSlug?: string;
}

const SECTION_META: Record<SectionType, { badge: string; badgeColor: string }> = {
  investment: { badge: "Top Investment", badgeColor: "bg-brand-600" },
  growth: { badge: "High Growth", badgeColor: "bg-purple-600" },
  family: { badge: "Family Friendly", badgeColor: "bg-trust-600" },
  popular: { badge: "Most Viewed", badgeColor: "bg-amber-600" },
  affordable: { badge: "Budget Friendly", badgeColor: "bg-emerald-600" },
};

function getSectionDescription(area: AreaDoc, section: SectionType): string {
  switch (section) {
    case "investment":
      return `Scores ${area.investmentScore}/100 for investment potential. ${area.nearbyITHubs?.length ? `Driven by ${area.nearbyITHubs.length} IT hub${area.nearbyITHubs.length > 1 ? "s" : ""} and infrastructure growth.` : "Strong appreciation potential due to development pipeline."}`;
    case "growth":
      return `Future growth score: ${area.futureGrowth}/100. ${area.nearbyITHubs?.length ? `${area.nearbyITHubs.slice(0, 2).join(" & ")} driving demand. ` : ""}New residential and commercial projects underway.`;
    case "family":
      return `Family score: ${area.familyScore}/100. ${area.nearbySchools?.length ? `Top schools: ${area.nearbySchools.slice(0, 2).join(", ")}. ` : ""}Safe neighborhoods with parks and community amenities.`;
    case "popular":
      return `${area.viewCount}+ property seekers viewed this area. Strong scores across investment (${area.investmentScore}), family (${area.familyScore}), and growth (${area.futureGrowth}).`;
    case "affordable":
      return `Avg. ₹${area.averagePrice.toLocaleString()}/sq.ft — budget-friendly without compromising on connectivity and essential amenities.`;
    default:
      return area.description;
  }
}

function getPrimaryValue(area: AreaDoc, section: SectionType): { label: string; value: string; icon: React.ReactNode } {
  switch (section) {
    case "affordable":
      return {
        label: "Price",
        value: `₹${area.averagePrice.toLocaleString()}/ft`,
        icon: <DollarSign size={10} />,
      };
    case "popular":
      return {
        label: "Views",
        value: `${area.viewCount}+`,
        icon: <Eye size={10} />,
      };
    case "growth":
      return {
        label: "Growth",
        value: `${area.futureGrowth}`,
        icon: <TrendingUp size={10} />,
      };
    default:
      return {
        label: "Score",
        value: `${area.investmentScore}`,
        icon: <BarChart3 size={10} />,
      };
  }
}

export function HomepageAreaCard({ area, section, comparisonSlug }: Props) {
  const meta = section ? SECTION_META[section] : { badge: "", badgeColor: "" };
  const description = section ? getSectionDescription(area, section) : area.description;
  const primary = section ? getPrimaryValue(area, section) : { label: "Score", value: `${area.investmentScore}`, icon: <BarChart3 size={10} /> };

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
        {meta.badge && (
          <span className={`absolute left-3 top-3 rounded-full ${meta.badgeColor} px-3 py-1 text-[10px] font-bold text-white shadow-sm`}>
            {meta.badge}
          </span>
        )}
        {/* Primary Metric Badge */}
        <div className="absolute bottom-3 right-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-center shadow-sm">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">{primary.label}</p>
          <p className="text-sm font-bold text-brand-600">{primary.value}</p>
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
        <p className="mt-1 text-sm text-slate-500 line-clamp-2 leading-relaxed">{description}</p>

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

        {comparisonSlug ? (
          <Link
            href={`/areas/compare/${comparisonSlug}`}
            onClick={(e) => e.stopPropagation()}
            className="mt-3 flex items-center justify-between rounded-xl bg-brand-50 px-3.5 py-2.5 transition-colors hover:bg-brand-100"
          >
            <span className="flex items-center gap-1.5 text-xs font-medium text-brand-700">
              <BarChart3 size={12} />
              Compare with another area
            </span>
            <ArrowRight size={14} className="text-brand-400 transition-all group-hover:translate-x-1" />
          </Link>
        ) : (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs font-medium text-brand-600 group-hover:underline">
              Explore Area Intelligence
            </span>
            <ArrowRight size={14} className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-brand-500" />
          </div>
        )}
      </div>
    </Link>
  );
}
