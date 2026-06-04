import { Metadata } from "next";
import Link from "next/link";
import { connectDB, isMongoConfigured } from "@/infrastructure/db/connection";
import { AreaComparisonModel } from "@/features/comparisons/models/AreaComparison";
import { getCanonical } from "@/lib/seo";
import { ArrowRight, BarChart3 } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Area Comparisons in Indore | AreaMatch";
  const description = "Compare Indore areas side-by-side — pricing, scores, connectivity, and livability. Find which area wins for your budget.";

  return {
    title,
    description,
    alternates: { canonical: getCanonical("/areas/compare") },
    openGraph: { title, description, url: "/areas/compare", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ComparisonListingPage() {
  let comparisons: { slug: string; heroHeading?: string; introText?: string; area1: unknown; area2: unknown }[] = [];

  if (isMongoConfigured()) {
    try {
      await connectDB();
      const docs = await AreaComparisonModel.find({ isActive: true })
        .populate("area1", "name slug")
        .populate("area2", "name slug")
        .sort({ sortOrder: 1 })
        .lean()
        .exec();
      comparisons = docs as unknown as typeof comparisons;
    } catch {
      comparisons = [];
    }
  }

  return (
    <div className="space-y-12 md:space-y-16 pt-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/" className="transition-colors hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link href="/areas" className="transition-colors hover:text-brand-600">Areas</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">Compare</span>
      </nav>

      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100">
            <BarChart3 size={20} className="text-brand-600" />
          </span>
          <h1 className="heading-xl text-slate-900">Area Comparisons</h1>
        </div>
        <p className="max-w-2xl text-base text-slate-600">
          Side-by-side comparisons of Indore&apos;s top areas. See how they stack up on price, scores, connectivity, and livability.
        </p>
      </section>

      {/* Grid */}
      {comparisons.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <p className="text-sm text-slate-400">No comparisons available yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {comparisons.map((cmp) => {
            const a1 = cmp.area1 as { name: string; slug: string } | null;
            const a2 = cmp.area2 as { name: string; slug: string } | null;
            if (!a1 || !a2) return null;

            return (
              <Link
                key={cmp.slug}
                href={`/areas/compare/${cmp.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-brand-200 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {a1.name} vs {a2.name}
                  </h3>
                  <ArrowRight size={16} className="text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-500" />
                </div>
                {cmp.introText ? (
                  <p className="mb-3 text-sm text-slate-500 line-clamp-2">{cmp.introText}</p>
                ) : (
                  <p className="mb-3 text-sm text-slate-400 line-clamp-2">
                    Compare {a1.name} and {a2.name} — pricing, scores, and livability.
                  </p>
                )}
                <div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{a1.name}</span>
                  <span className="text-slate-300">vs</span>
                  <span className="font-semibold text-slate-700">{a2.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
