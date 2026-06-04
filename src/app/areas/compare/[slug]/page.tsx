import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB, isMongoConfigured } from "@/infrastructure/db/connection";
import { AreaModel } from "@/features/colony-intelligence/models/Area";
import { AreaComparisonModel } from "@/features/comparisons/models/AreaComparison";
import { getCanonical } from "@/lib/seo";
import { ComparisonHero } from "@/components/comparisons/ComparisonHero";
import { ScoreComparisonSection } from "@/components/comparisons/ScoreComparisonSection";
import { KeyDifferencesSection } from "@/components/comparisons/KeyDifferencesSection";
import { WhoBuysSection } from "@/components/comparisons/WhoBuysSection";
import { VerdictByBudgetSection } from "@/components/comparisons/VerdictByBudgetSection";
import { ProsConsSection } from "@/components/areas/ProsConsSection";
import { VerdictSection } from "@/components/comparisons/VerdictSection";
import { RelatedAreasSection } from "@/components/areas/RelatedAreasSection";
import { AreaLeadForm } from "@/components/areas/AreaLeadForm";
import { WhatsAppStickyCTA } from "@/components/areas/WhatsAppStickyCTA";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  if (!isMongoConfigured()) return [];
  try {
    await connectDB();
    const slugs = await AreaComparisonModel.find({ isActive: true })
      .select("slug")
      .lean()
      .exec();
    return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isMongoConfigured()) return {};
  try {
    await connectDB();
    const comparison = await AreaComparisonModel.findOne({ slug })
      .populate("area1", "name")
      .populate("area2", "name")
      .lean()
      .exec();
    if (!comparison) return {};

    const area1 = comparison.area1 as unknown as { name: string } | null;
    const area2 = comparison.area2 as unknown as { name: string } | null;
    const title = comparison.metaTitle || (area1 && area2 ? `${area1.name} vs ${area2.name} Property Comparison | AreaMatch` : "Area Comparison | AreaMatch");
    const description = comparison.metaDescription || "";

    return {
      title,
      description,
      alternates: { canonical: getCanonical(`/areas/compare/${slug}`) },
      openGraph: { title, description, url: `/areas/compare/${slug}`, type: "website" },
      twitter: { card: "summary_large_image", title, description },
    };
  } catch {
    return {};
  }
}

export default async function ComparisonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isMongoConfigured()) notFound();

  await connectDB();
  const comparison = await AreaComparisonModel.findOne({ slug, isActive: true })
    .populate("area1")
    .populate("area2")
    .lean()
    .exec();

  if (!comparison) notFound();

  const area1 = comparison.area1 as unknown as Record<string, unknown>;
  const area2 = comparison.area2 as unknown as Record<string, unknown>;

  const area1Name = (area1.name as string) || "";
  const area1Slug = (area1.slug as string) || "";
  const area2Name = (area2.name as string) || "";
  const area2Slug = (area2.slug as string) || "";

  // Fetch 3 other areas for "Also explore"
  const otherAreas = await AreaModel.find({
    published: true,
    slug: { $nin: [area1Slug, area2Slug] }
  })
    .sort({ investmentScore: -1 })
    .limit(3)
    .lean()
    .exec();

  return (
    <>
      <div className="space-y-12 md:space-y-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="transition-colors hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link href="/areas" className="transition-colors hover:text-brand-600">Areas</Link>
          <span>/</span>
          <Link href="/areas/compare" className="transition-colors hover:text-brand-600">Compare</Link>
          <span>/</span>
          <span className="text-slate-600 font-medium">{area1Name} vs {area2Name}</span>
        </nav>

        {/* A) Hero */}
        <ComparisonHero
          heroHeading={comparison.heroHeading || `${area1Name} vs ${area2Name}: Which Area to Buy in Indore?`}
          introText={comparison.introText || undefined}
          area1={{ name: area1Name, slug: area1Slug }}
          area2={{ name: area2Name, slug: area2Slug }}
        />

        {/* B) Score Comparison */}
        <ScoreComparisonSection
          area1={area1 as Parameters<typeof ScoreComparisonSection>[0]["area1"]}
          area2={area2 as Parameters<typeof ScoreComparisonSection>[0]["area2"]}
        />

        {/* C) Key Differences */}
        <KeyDifferencesSection
          keyDifferences={(comparison.keyDifferences as { parameter: string; area1Value: string; area2Value: string }[]) || []}
          area1={area1 as unknown as Parameters<typeof KeyDifferencesSection>[0]["area1"]}
          area2={area2 as unknown as Parameters<typeof KeyDifferencesSection>[0]["area2"]}
        />

        {/* D) Who Should Buy */}
        <WhoBuysSection
          whoBuysHere={comparison.whoBuysHere as { area1Profile?: string; area2Profile?: string } | null | undefined}
          area1Name={area1Name}
          area2Name={area2Name}
        />

        {/* E) Verdict by Budget */}
        <VerdictByBudgetSection
          verdictForBudgets={(comparison.verdictForBudgets as { budgetLabel: string; recommendedArea: "area1" | "area2"; reason: string }[]) || []}
          area1={{ name: area1Name, slug: area1Slug }}
          area2={{ name: area2Name, slug: area2Slug }}
        />

        {/* F) Pros & Cons side by side */}
        <section>
          <h2 className="heading-md mb-6 text-slate-900">Pros & Cons at a Glance</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 font-display text-lg font-bold text-slate-800">{area1Name}</h3>
              <ProsConsSection
                pros={(area1.pros as string[]) || []}
                cons={(area1.cons as string[]) || []}
              />
            </div>
            <div>
              <h3 className="mb-3 font-display text-lg font-bold text-slate-800">{area2Name}</h3>
              <ProsConsSection
                pros={(area2.pros as string[]) || []}
                cons={(area2.cons as string[]) || []}
              />
            </div>
          </div>
        </section>

        {/* G) Verdict */}
        <VerdictSection verdict={(comparison.verdict as string) || null} />

        {/* H) Suggested Areas */}
        <RelatedAreasSection areas={otherAreas as Parameters<typeof RelatedAreasSection>[0]["areas"]} currentSlug="compare" />

        {/* I) Lead Form */}
        <div className="max-w-lg mx-auto w-full">
          <AreaLeadForm areaName={`Comparing ${area1Name} vs ${area2Name}`} />
        </div>
      </div>

      {/* J) WhatsApp Sticky CTA */}
      <WhatsAppStickyCTA areaName={`${area1Name} vs ${area2Name}`} />
    </>
  );
}
