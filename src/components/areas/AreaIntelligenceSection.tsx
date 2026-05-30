import { ScoreBar } from "./ScoreBar";
import { Brain } from "lucide-react";

interface AreaIntelligenceSectionProps {
  investmentScore: number;
  familyScore: number;
  rentalDemand: number;
  futureGrowth: number;
  trafficScore?: number;
  trafficCondition: number;
}

export function AreaIntelligenceSection({
  investmentScore,
  familyScore,
  rentalDemand,
  futureGrowth,
  trafficScore,
  trafficCondition,
}: AreaIntelligenceSectionProps) {
  const trafficValue = trafficScore ?? trafficCondition * 10;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
      <div className="mb-6 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100">
          <Brain size={18} className="text-brand-600" />
        </span>
        <div>
          <h2 className="heading-md text-slate-900">AI-Powered Area Intelligence</h2>
          <p className="text-sm text-slate-500">Data-driven analysis based on market research & trends</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5">
          <ScoreBar score={investmentScore} label="Investment Score" sublabel="Long-term ROI potential" color="brand" />
          <ScoreBar score={familyScore} label="Family Score" sublabel="Community & education quality" color="trust" />
          <ScoreBar score={rentalDemand} label="Rental Demand" sublabel="Tenant demand & yield stability" color="amber" />
        </div>
        <div className="space-y-5">
          <ScoreBar score={futureGrowth} label="Future Growth" sublabel="Infrastructure & development pipeline" color="purple" />
          <ScoreBar score={trafficValue} label="Traffic & Connectivity" sublabel="Road quality & commute ease" color="amber" />
        </div>
      </div>
    </section>
  );
}
