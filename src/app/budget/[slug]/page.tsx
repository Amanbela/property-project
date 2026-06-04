import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getActiveBudgetRanges, getBudgetRangeBySlug } from "@/features/budget/services/budget-service";
import { getCanonical } from "@/lib/seo";
import { extractImageUrl } from "@/shared/types/models";
import { HomepageAreaCard } from "@/components/areas/HomepageAreaCard";
import { AreaLeadForm } from "@/components/areas/AreaLeadForm";
import { WhatsAppStickyCTA } from "@/components/areas/WhatsAppStickyCTA";
import { BudgetComparisonLinks } from "@/components/comparisons/BudgetComparisonLinks";
import { ComparisonRepository } from "@/infrastructure/db/repositories/ComparisonRepository";
import { ArrowRight, IndianRupee, Lightbulb, Info } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const range = await getBudgetRangeBySlug(slug);
  if (!range) return {};

  const title = range.heroHeading || `${range.label} — Best Areas in Indore`;
  const description = range.metaDescription || range.description;

  return {
    title,
    description,
    alternates: { canonical: getCanonical(`/budget/${slug}`) },
    openGraph: {
      title,
      description,
      url: `/budget/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(0)} L`;
  return `₹${price.toLocaleString()}`;
}

function formatPriceRange(min: number, max: number): string {
  const minStr = formatPrice(min);
  const maxStr = max >= 999999999 ? "Above" : formatPrice(max);
  return max >= 999999999 ? `${maxStr} ${minStr}` : `${minStr} – ${maxStr}`;
}

interface AreaCardData {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  featuredImage: string;
  averagePrice: number;
  investmentScore: number;
  familyScore: number;
  futureGrowth: number;
  rentalDemand?: number;
  trafficCondition?: number;
  nearbySchools?: string[];
  nearbyHospitals?: string[];
  nearbyMetro?: boolean;
  coordinates?: { lat: number; lng: number };
  gallery?: string[];
  pros?: string[];
  cons?: string[];
  lifestyleTags?: string[];
  createdAt?: string;
}

function toAreaCardData(area: Record<string, unknown>): AreaCardData {
  return {
    _id: String(area._id ?? ""),
    name: String(area.name ?? ""),
    slug: String(area.slug ?? ""),
    description: String(area.description ?? ""),
    featuredImage: extractImageUrl(area.featuredImage),
    averagePrice: Number(area.averagePrice ?? area.averagePricePerSqft ?? 0),
    investmentScore: Number(area.investmentScore ?? 0),
    familyScore: Number(area.familyScore ?? 0),
    futureGrowth: Number(area.futureGrowth ?? 0),
    rentalDemand: Number(area.rentalDemand ?? 0),
    trafficCondition: Number(area.trafficCondition ?? 0),
    nearbySchools: (area.nearbySchools as string[]) ?? [],
    nearbyHospitals: (area.nearbyHospitals as string[]) ?? [],
    nearbyMetro: Boolean(area.nearbyMetro),
    coordinates: area.coordinates
      ? { lat: Number((area.coordinates as Record<string, number>).lat ?? 0), lng: Number((area.coordinates as Record<string, number>).lng ?? 0) }
      : { lat: 0, lng: 0 },
    gallery: Array.isArray(area.gallery) ? area.gallery.map((g) => extractImageUrl(g)) : [],
    pros: (area.pros as string[]) ?? [],
    cons: (area.cons as string[]) ?? [],
    lifestyleTags: (area.lifestyleTags as string[]) ?? [],
    createdAt: area.createdAt ? new Date(area.createdAt as Date).toISOString() : new Date().toISOString(),
  };
}

export default async function BudgetRangeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const range = await getBudgetRangeBySlug(slug);
  if (!range) notFound();

  const allRanges = await getActiveBudgetRanges();
  const currentIndex = allRanges.findIndex((r) => r.slug === slug);
  const relatedRanges = allRanges.filter((_, i) => Math.abs(i - currentIndex) <= 1 && i !== currentIndex);

  const rawAreas: unknown[] = Array.isArray(range.recommendedAreas) ? range.recommendedAreas : [];
  const areas: AreaCardData[] = rawAreas
    .filter((a): a is Record<string, unknown> => a !== null && a !== undefined)
    .map((a) => toAreaCardData(a));

  const areaIds = areas.map((a) => a._id ?? "").filter(Boolean);
  const budgetComparisons = areaIds.length > 0
    ? (await ComparisonRepository.findByAreaIdList(areaIds).catch(() => [])) as {
        slug: string;
        heroHeading?: string;
        introText?: string;
        area1: string | Record<string, unknown>;
        area2: string | Record<string, unknown>;
      }[]
    : [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: range.heroHeading || range.label,
    description: range.description,
    numberOfItems: areas.length,
    itemListElement: areas.map((area, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Place",
        name: `${area.name}, Indore`,
        url: `https://indorepropertybudgetfinder.com/areas/${area.slug}`,
      },
    })),
  };

  return (
    <>
      <div className="space-y-12 md:space-y-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="transition-colors hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link href="/budget" className="transition-colors hover:text-brand-600">Budget</Link>
          <span>/</span>
          <span className="text-slate-600 font-medium">{range.label}</span>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10 md:px-10 md:py-16 lg:px-14 lg:py-20">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
          <div className="relative z-10">
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
                <IndianRupee size={14} />
                {formatPriceRange(range.minPrice, range.maxPrice)}
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl max-w-3xl">
              {range.heroHeading || `Best Areas in Indore ${range.label}`}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              {range.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/70">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
                {areas.length} Recommended {areas.length === 1 ? "Area" : "Areas"}
              </span>
              <span className="text-white/30">•</span>
              <span className="text-xs">Indore, Madhya Pradesh</span>
            </div>
          </div>
        </section>

        {/* Why This Budget Section */}
        {(range.whyThisBudget || range.tipForBuyers) && (
          <section className="grid gap-6 md:grid-cols-2">
            {range.whyThisBudget && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Info size={20} />
                  </div>
                  <h2 className="font-display text-xl font-bold text-slate-900">Why This Budget?</h2>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">{range.whyThisBudget}</p>
              </div>
            )}
            {range.tipForBuyers && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 md:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Lightbulb size={20} />
                  </div>
                  <h2 className="font-display text-xl font-bold text-amber-900">Tip for Buyers</h2>
                </div>
                <p className="text-sm leading-relaxed text-amber-800">{range.tipForBuyers}</p>
              </div>
            )}
          </section>
        )}

        {/* Recommended Areas Section */}
        {areas.length > 0 && (
          <section>
            <h2 className="heading-md mb-2 text-slate-900">Recommended Areas</h2>
            <p className="mb-6 text-sm text-slate-500">
              Top localities in Indore that fit your {range.label.toLowerCase()} budget range.
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {areas.map((area) => (
                <HomepageAreaCard
                  key={area._id ?? area.slug}
                  area={area as import("@/features/colony-intelligence/services/area-service").AreaDoc}
                />
              ))}
            </div>
          </section>
        )}

        {/* Budget Comparisons */}
        {budgetComparisons.length > 0 && (
          <BudgetComparisonLinks comparisons={budgetComparisons} />
        )}

        {/* Lead Form */}
        <div className="max-w-lg mx-auto w-full">
          <AreaLeadForm areaName={`${range.label} budget`} />
        </div>

        {/* Related Budget Ranges */}
        {relatedRanges.length > 0 && (
          <section>
            <h2 className="heading-md mb-2 text-slate-900">Other Budget Ranges</h2>
            <p className="mb-6 text-sm text-slate-500">Explore other budget ranges that might interest you</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedRanges.map((r) => (
                <Link
                  key={r._id ?? r.slug}
                  href={`/budget/${r.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-brand-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="badge-slate inline-flex items-center gap-1 mb-1 text-xs">
                        <IndianRupee size={10} className="text-slate-400" />
                        {formatPriceRange(r.minPrice, r.maxPrice)}
                      </span>
                      <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                        {r.label}
                      </h3>
                    </div>
                    <ArrowRight size={16} className="mt-1 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-500" />
                  </div>
                  <p className="mt-2 text-sm text-slate-500 line-clamp-1">{r.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* WhatsApp Sticky CTA */}
      <WhatsAppStickyCTA areaName={range.label} defaultBudget={range.label} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
