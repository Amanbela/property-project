import Link from "next/link";
import { Metadata } from "next";
import { getActiveBudgetRanges } from "@/features/budget/services/budget-service";
import { getCanonical } from "@/lib/seo";
import { ArrowRight, IndianRupee } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Budget-Wise Area Guide for Indore | AreaMatch",
    description:
      "Find the best areas in Indore based on your budget. From under ₹30 Lakh to ₹1.5 Cr+, discover top localities, property prices, and investment potential.",
    alternates: { canonical: getCanonical("/budget") },
    openGraph: {
      title: "Budget-Wise Area Guide for Indore | AreaMatch",
      description:
        "Find the best areas in Indore based on your budget. From under ₹30 Lakh to ₹1.5 Cr+, discover top localities, property prices, and investment potential.",
      url: "/budget",
      type: "website",
    },
  };
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(0)} L`;
  return `₹${price.toLocaleString()}`;
}

export default async function BudgetPage() {
  const ranges = await getActiveBudgetRanges();

  return (
    <div className="pb-8 space-y-8">
      <div className="glass-panel rounded-3xl p-6 md:p-8">
        <h1 className="heading-xl">Find Areas in Indore by Budget</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base dark:text-slate-300">
          Choose your budget range to discover the best areas, property options, and investment insights tailored for you.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ranges.map((range) => {
          const areaCount = Array.isArray(range.recommendedAreas) ? range.recommendedAreas.length : 0;
          return (
            <Link
              key={range._id ?? range.slug}
              href={`/budget/${range.slug}`}
              className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <IndianRupee size={22} />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Budget Range</span>
                  <p className="font-display text-lg font-bold text-slate-900">{range.label}</p>
                </div>
              </div>

              <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
                {range.description}
              </p>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-medium text-slate-500">
                  {areaCount} {areaCount === 1 ? "area" : "areas"} available
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:underline">
                  Explore Areas
                  <ArrowRight size={14} className="transition-all group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {ranges.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
          <p className="text-sm text-slate-500">Budget ranges are being curated. Check back soon.</p>
        </div>
      )}
    </div>
  );
}
