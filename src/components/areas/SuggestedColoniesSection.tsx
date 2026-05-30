import type { Colony } from "@/shared/types/models";
import { TrendingUp, Home, Shield, MapPin } from "lucide-react";

interface SuggestedColoniesSectionProps {
  colonies: Colony[];
  areaName: string;
}

function growthLabel(score: number): string {
  if (score >= 80) return "High Growth";
  if (score >= 60) return "Steady Growth";
  return "Stable";
}

function priceDisplay(colony: Colony): string {
  const prices: string[] = [];
  if (colony.averagePlotPrice) prices.push(`Plot: ₹${colony.averagePlotPrice.toLocaleString()}/sq.ft`);
  if (colony.averageFlatPrice) prices.push(`Flat: ₹${colony.averageFlatPrice.toLocaleString()}/sq.ft`);
  return prices.join(" | ") || "Price on request";
}

export function SuggestedColoniesSection({ colonies, areaName }: SuggestedColoniesSectionProps) {
  if (colonies.length === 0) return null;

  return (
    <section>
      <h2 className="heading-md mb-6 text-slate-900">Popular Colonies in {areaName}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {colonies.map((colony) => (
          <div
            key={colony._id}
            className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-brand-200 hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <span className="badge-slate flex items-center gap-1 mb-1.5 text-xs">
                  <MapPin size={10} className="text-slate-400" />
                  {areaName}
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  {colony.colonyName}
                </h3>
              </div>
              {colony.reraStatus && (
                <span className="rounded-full bg-trust-50 px-2 py-0.5 text-[10px] font-bold text-trust-600 ring-1 ring-trust-100">
                  RERA
                </span>
              )}
            </div>

            <div className="mb-3 rounded-xl bg-slate-50 px-3 py-2.5">
              <p className="text-xs text-slate-500 mb-0.5">Average Price</p>
              <p className="text-sm font-semibold text-slate-800">{priceDisplay(colony)}</p>
            </div>

            <div className="flex items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <TrendingUp size={13} className="text-brand-500" />
                <span className="font-medium">{colony.investmentScore}/100</span>
              </div>
              {colony.futureGrowthScore && (
                <div className="flex items-center gap-1">
                  <Shield size={13} className="text-purple-500" />
                  <span className="font-medium">{growthLabel(colony.futureGrowthScore)}</span>
                </div>
              )}
              {colony.possessionStatus && (
                <div className="flex items-center gap-1">
                  <Home size={13} className="text-trust-500" />
                  <span className="font-medium">{colony.possessionStatus === "Ready to Move" ? "Ready" : colony.possessionStatus}</span>
                </div>
              )}
            </div>

            {colony.pros && colony.pros.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {colony.pros.slice(0, 2).map((pro, i) => (
                  <span key={i} className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-600">
                    {pro}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
