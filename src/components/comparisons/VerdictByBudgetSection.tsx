import Link from "next/link";
import { IndianRupee } from "lucide-react";

interface VerdictForBudget {
  budgetLabel: string;
  recommendedArea: "area1" | "area2";
  reason: string;
}

interface VerdictByBudgetSectionProps {
  verdictForBudgets: VerdictForBudget[];
  area1: { name: string; slug: string };
  area2: { name: string; slug: string };
}

export function VerdictByBudgetSection({ verdictForBudgets, area1, area2 }: VerdictByBudgetSectionProps) {
  if (verdictForBudgets.length === 0) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
      <div className="mb-6 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
          <IndianRupee size={18} className="text-amber-600" />
        </span>
        <div>
          <h2 className="heading-md text-slate-900">Verdict by Budget</h2>
          <p className="text-sm text-slate-500">Which area wins at different budget levels</p>
        </div>
      </div>
      <div className="space-y-3">
        {verdictForBudgets.map((item, i) => {
          const recommended = item.recommendedArea === "area1" ? area1 : area2;
          return (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 md:flex-row md:items-center md:gap-4"
            >
              <span className="shrink-0 rounded-lg bg-slate-200 px-3 py-1 text-sm font-bold text-slate-800">
                {item.budgetLabel}
              </span>
              <Link
                href={`/areas/${recommended.slug}`}
                className="shrink-0 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-200"
              >
                {recommended.name}
              </Link>
              <p className="text-sm text-slate-600">{item.reason}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
