import Link from "next/link";
import { Compass, ArrowRight, BarChart3 } from "lucide-react";

export function BlogRecommendationCTA() {
  return (
    <section className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-6 md:p-8">
      <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-start md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-100">
            <Compass size={24} className="text-brand-600" />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">
              Looking for the Best Area Based on Your Budget?
            </h3>
            <p className="mt-1 text-sm text-slate-600 max-w-lg">
              Skip the listings. Tell us your budget and get AI-powered area recommendations tailored to you.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href="/areas/compare"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-brand-200 hover:text-brand-600 hover:shadow-md"
          >
            <BarChart3 size={15} />
            Compare Areas
          </Link>
          <Link
            href="/#wizard-section"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md"
          >
            Start Recommendation <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
