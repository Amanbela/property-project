import { ScoreRing } from "@/components/ui/ScoreRing";

interface ScoreComparisonSectionProps {
  area1: { name: string; investmentScore: number; familyScore: number; rentalDemand: number; futureGrowth: number; trafficScore?: number };
  area2: { name: string; investmentScore: number; familyScore: number; rentalDemand: number; futureGrowth: number; trafficScore?: number };
}

function avgScore(a: { investmentScore: number; familyScore: number; rentalDemand: number; futureGrowth: number; trafficScore?: number }): number {
  const vals = [a.investmentScore, a.familyScore, a.rentalDemand, a.futureGrowth, a.trafficScore ?? 0];
  return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
}

function connectivityScore(a: { trafficScore?: number }): number {
  return a.trafficScore ?? 0;
}

export function ScoreComparisonSection({ area1, area2 }: ScoreComparisonSectionProps) {
  const ringConfigs: { label: string; getVal: (a: typeof area1) => number }[] = [
    { label: "Overall Score", getVal: avgScore },
    { label: "Investment Score", getVal: (a) => a.investmentScore },
    { label: "Livability Score", getVal: (a) => a.familyScore },
    { label: "Connectivity Score", getVal: connectivityScore },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
      <div className="mb-6">
        <h2 className="heading-md text-slate-900">Score Comparison</h2>
        <p className="text-sm text-slate-500">Side-by-side intelligence scores</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Area 1 scores */}
        <div className="space-y-6">
          <h3 className="text-center font-display text-lg font-bold text-slate-900">{area1.name}</h3>
          <div className="grid grid-cols-2 gap-4">
            {ringConfigs.map((cfg) => {
              const val1 = cfg.getVal(area1);
              const val2 = cfg.getVal(area2);
              const winner = val1 > val2 ? "ring-2 ring-emerald-400 rounded-2xl p-2" : "p-2";
              return (
                <div key={cfg.label} className={winner}>
                  <ScoreRing score={val1} size={72} label={cfg.label} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Area 2 scores */}
        <div className="space-y-6">
          <h3 className="text-center font-display text-lg font-bold text-slate-900">{area2.name}</h3>
          <div className="grid grid-cols-2 gap-4">
            {ringConfigs.map((cfg) => {
              const val1 = cfg.getVal(area1);
              const val2 = cfg.getVal(area2);
              const winner = val2 > val1 ? "ring-2 ring-emerald-400 rounded-2xl p-2" : "p-2";
              return (
                <div key={cfg.label} className={winner}>
                  <ScoreRing score={val2} size={72} label={cfg.label} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
