import { Check } from "lucide-react";

interface WhyRecommendedSectionProps {
  investmentScore: number;
  familyScore: number;
  rentalDemand: number;
  futureGrowth: number;
  trafficCondition: number;
  pros: string[];
  budgetCategory?: string[];
  tags?: string[];
}

function generateReasons(props: WhyRecommendedSectionProps): string[] {
  const reasons: string[] = [];

  if (props.investmentScore >= 70) reasons.push("High investment potential with strong appreciation");
  if (props.familyScore >= 70) reasons.push("Family-friendly neighborhood with good social infrastructure");
  if (props.rentalDemand >= 70) reasons.push("Strong rental demand for steady income");
  if (props.futureGrowth >= 70) reasons.push("High future growth potential with upcoming developments");
  if (props.trafficCondition >= 60) reasons.push("Smooth traffic flow and good road connectivity");
  if (props.investmentScore >= 80) reasons.push("Top-rated investment zone in Indore");
  if (props.familyScore >= 80) reasons.push("Excellent community living with top schools nearby");
  if (props.rentalDemand >= 80) reasons.push("Premium rental yields with high tenant demand");
  if (props.futureGrowth >= 80) reasons.push("Future-ready infrastructure with metro & IT hub proximity");
  if (props.budgetCategory?.includes("budget")) reasons.push("Budget-friendly investment zone");
  if (props.budgetCategory?.includes("mid-range")) reasons.push("Balanced mid-range pricing with great value");
  if (props.tags?.includes("connectivity")) reasons.push("Excellent connectivity to major city hubs");
  if (props.tags?.includes("green")) reasons.push("Green surroundings with good environmental quality");

  props.pros.slice(0, 3).forEach((p) => {
    if (!reasons.some((r) => r.toLowerCase().includes(p.toLowerCase().slice(0, 10)))) {
      reasons.push(p);
    }
  });

  return reasons.slice(0, 6);
}

export function WhyRecommendedSection(props: WhyRecommendedSectionProps) {
  const reasons = generateReasons(props);

  if (reasons.length === 0) return null;

  return (
    <section className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 to-white p-6 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
          <Check size={14} className="text-emerald-600" />
        </span>
        <h2 className="heading-md text-emerald-900">Why This Area is Recommended</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {reasons.map((reason, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-emerald-100/50">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <Check size={11} className="text-emerald-600" strokeWidth={3} />
            </span>
            <span className="text-sm font-medium text-slate-700">{reason}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
