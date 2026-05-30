import Image from "next/image";
import { TrendingUp, Home, Users, Building2 } from "lucide-react";

interface AreaHeroProps {
  name: string;
  description: string;
  featuredImage: string;
  averagePrice: number;
  investmentScore: number;
  futureGrowth: number;
  rentalDemand: number;
  tags: string[];
  propertyTypes?: string[];
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Average";
  return "Developing";
}

export function AreaHero({
  name,
  description,
  featuredImage,
  averagePrice,
  investmentScore,
  futureGrowth,
  rentalDemand,
  tags,
  propertyTypes,
}: AreaHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Image */}
      {featuredImage && (
        <div className="absolute inset-0 opacity-30">
          <Image
            src={featuredImage}
            alt={name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-6 py-10 md:px-10 md:py-16 lg:px-14 lg:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {/* Left: Name + Description */}
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap gap-2">
              {tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              {name}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-white/80 md:text-lg">
              {description}
            </p>
          </div>

          {/* Right: Price + Score Highlight */}
          <div className="flex shrink-0 flex-col gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur-md">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Avg Price</p>
              <p className="font-display text-2xl font-bold text-white">
                ₹{averagePrice.toLocaleString()}
                <span className="ml-1 text-sm font-normal text-white/60">/sq.ft</span>
              </p>
            </div>
            <div className="flex gap-6 border-t border-white/10 pt-4">
              <div className="text-center">
                <TrendingUp size={18} className="mx-auto text-emerald-400" />
                <p className="mt-1 text-lg font-bold text-white">{investmentScore}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Investment</p>
              </div>
              <div className="text-center">
                <Building2 size={18} className="mx-auto text-blue-400" />
                <p className="mt-1 text-lg font-bold text-white">{futureGrowth}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Growth</p>
              </div>
              <div className="text-center">
                <Users size={18} className="mx-auto text-purple-400" />
                <p className="mt-1 text-lg font-bold text-white">{rentalDemand}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Rental</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row: Property types + score label */}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
          {propertyTypes && propertyTypes.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Home size={14} />
              <span>Properties:</span>
              {propertyTypes.map((t) => (
                <span key={t} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/80 capitalize">
                  {t}
                </span>
              ))}
            </div>
          )}
          <span className="ml-auto rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
            {scoreLabel(investmentScore)} Investment Score
          </span>
        </div>
      </div>
    </section>
  );
}
