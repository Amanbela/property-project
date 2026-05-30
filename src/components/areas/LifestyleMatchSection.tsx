import { Users, TrendingUp, DollarSign, GraduationCap, Building2, Heart } from "lucide-react";

interface LifestyleMatchSectionProps {
  familyScore: number;
  investmentScore: number;
  rentalDemand: number;
  tags: string[];
  propertyTypes?: string[];
}

interface MatchCard {
  icon: typeof Users;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  iconColor: string;
}

export function LifestyleMatchSection({
  familyScore,
  investmentScore,
  rentalDemand,
  tags,
  propertyTypes,
}: LifestyleMatchSectionProps) {
  const matches: MatchCard[] = [
    {
      icon: familyScore >= 70 ? Users : Heart,
      title: "Best for Families",
      description: familyScore >= 70
        ? "Excellent community living with quality schools and green spaces"
        : "Moderate family suitability with developing social infrastructure",
      color: "border-trust-200",
      bgColor: "bg-trust-50",
      iconColor: "text-trust-600",
    },
    {
      icon: TrendingUp,
      title: "Best for Investment",
      description: investmentScore >= 70
        ? "Strong appreciation potential with high ROI for long-term investors"
        : "Consider for mid-term investment with steady growth outlook",
      color: "border-brand-200",
      bgColor: "bg-brand-50",
      iconColor: "text-brand-600",
    },
    {
      icon: DollarSign,
      title: "Best for Rental Income",
      description: rentalDemand >= 70
        ? "High tenant demand with consistent rental yields"
        : "Moderate rental market with selective demand",
      color: "border-amber-200",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      icon: GraduationCap,
      title: "Student Friendly",
      description: tags.some((t) => ["student", "college", "education", "university"].includes(t.toLowerCase()))
        ? "Close to educational institutions with strong student housing demand"
        : "Developing student infrastructure in the vicinity",
      color: "border-purple-200",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: Building2,
      title: "Commercial Growth",
      description: tags.some((t) => ["commercial", "it", "business", "corporate"].includes(t.toLowerCase()))
        ? "Growing commercial hub with IT and business presence"
        : "Primarily residential with developing commercial zones",
      color: "border-sky-200",
      bgColor: "bg-sky-50",
      iconColor: "text-sky-600",
    },
  ];

  return (
    <section>
      <h2 className="heading-md mb-6 text-slate-900">Lifestyle & Purpose Match</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => {
          const Icon = match.icon;
          return (
            <div
              key={match.title}
              className={`rounded-2xl border ${match.color} ${match.bgColor} p-5`}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <Icon size={20} className={match.iconColor} />
              </div>
              <h3 className="mb-1 font-display text-base font-bold text-slate-900">{match.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{match.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
