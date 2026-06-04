interface KeyDifference {
  parameter: string;
  area1Value: string;
  area2Value: string;
}

interface AreaScores {
  name: string;
  investmentScore: number;
  familyScore: number;
  rentalDemand: number;
  futureGrowth: number;
  trafficScore?: number;
  averagePricePerSqft?: number;
  averagePrice?: number;
}

interface KeyDifferencesSectionProps {
  keyDifferences: KeyDifference[];
  area1: AreaScores;
  area2: AreaScores;
}

function isNumeric(val: string): boolean {
  return /^[₹€$]?[\d,]+/.test(val);
}

function compareValues(v1: string, v2: string): "a1" | "a2" | "tie" {
  const n1 = parseFloat(v1.replace(/[₹,]/g, ""));
  const n2 = parseFloat(v2.replace(/[₹,]/g, ""));
  if (isNaN(n1) || isNaN(n2)) return "tie";
  if (n1 > n2) return "a1";
  if (n2 > n1) return "a2";
  return "tie";
}

function scoreRow(parameter: string, getVal: (a: AreaScores) => number, area1: AreaScores, area2: AreaScores) {
  const val1 = getVal(area1);
  const val2 = getVal(area2);
  return (
    <tr key={parameter} className="border-b border-slate-100 last:border-0">
      <td className="py-3 pr-4 text-sm font-medium text-slate-700">{parameter}</td>
      <td className={`py-3 px-4 text-sm ${val1 > val2 ? "font-semibold text-emerald-600" : "text-slate-600"}`}>
        {val1}
        {val1 > val2 && <span className="ml-1.5 text-emerald-500">↑</span>}
      </td>
      <td className={`py-3 px-4 text-sm ${val2 > val1 ? "font-semibold text-emerald-600" : "text-slate-600"}`}>
        {val2}
        {val2 > val1 && <span className="ml-1.5 text-emerald-500">↑</span>}
      </td>
    </tr>
  );
}

export function KeyDifferencesSection({ keyDifferences, area1, area2 }: KeyDifferencesSectionProps) {
  const hasCustom = keyDifferences.length > 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
      <h2 className="heading-md mb-2 text-slate-900">Key Differences</h2>
      <p className="mb-6 text-sm text-slate-500">
        {hasCustom ? "Curated comparison" : "Live data comparison"}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Parameter</th>
              <th className="pb-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{area1.name}</th>
              <th className="pb-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{area2.name}</th>
            </tr>
          </thead>
          <tbody>
            {hasCustom
              ? keyDifferences.map((diff) => {
                  const winner = compareValues(diff.area1Value, diff.area2Value);
                  return (
                    <tr key={diff.parameter} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 pr-4 text-sm font-medium text-slate-700">{diff.parameter}</td>
                      <td className={`py-3 px-4 text-sm ${winner === "a1" ? "font-semibold text-emerald-600" : "text-slate-600"}`}>
                        {diff.area1Value}
                        {winner === "a1" && <span className="ml-1.5 text-emerald-500">↑</span>}
                      </td>
                      <td className={`py-3 px-4 text-sm ${winner === "a2" ? "font-semibold text-emerald-600" : "text-slate-600"}`}>
                        {diff.area2Value}
                        {winner === "a2" && <span className="ml-1.5 text-emerald-500">↑</span>}
                      </td>
                    </tr>
                  );
                })
              : [
                  scoreRow("Avg Price/sqft", (a) => a.averagePricePerSqft ?? a.averagePrice ?? 0, area1, area2),
                  scoreRow("Overall Score", (a) => Math.round(
                    [a.investmentScore, a.familyScore, a.rentalDemand, a.futureGrowth, a.trafficScore ?? 0]
                      .reduce((s, v) => s + v, 0) / 5
                  ), area1, area2),
                  scoreRow("Investment Score", (a) => a.investmentScore, area1, area2),
                  scoreRow("Connectivity", (a) => a.trafficScore ?? 0, area1, area2),
                  scoreRow("Livability", (a) => a.familyScore, area1, area2),
                ]}
          </tbody>
        </table>
      </div>
    </section>
  );
}
