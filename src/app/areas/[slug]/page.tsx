import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAreaDetailData } from "@/features/colony-intelligence/services/area-service";
import { getCanonical } from "@/lib/seo";
import { AreaHero } from "@/components/areas/AreaHero";
import { WhyRecommendedSection } from "@/components/areas/WhyRecommendedSection";
import { AreaIntelligenceSection } from "@/components/areas/AreaIntelligenceSection";
import { SuggestedColoniesSection } from "@/components/areas/SuggestedColoniesSection";
import { LifestyleMatchSection } from "@/components/areas/LifestyleMatchSection";
import { NearbyFacilitiesSection } from "@/components/areas/NearbyFacilitiesSection";
import { ProsConsSection } from "@/components/areas/ProsConsSection";
import { AreaLeadForm } from "@/components/areas/AreaLeadForm";
import { RelatedAreasSection } from "@/components/areas/RelatedAreasSection";
import { WhatsAppStickyCTA } from "@/components/areas/WhatsAppStickyCTA";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getAreaDetailData(slug);
  if (!data) return {};

  const { area } = data;
  const title = area.seoTitle || `${area.name} Property Intelligence & Investment Guide ${new Date().getFullYear()}`;
  const description = area.seoDescription || `Smart area intelligence report for ${area.name}, Indore. View investment score (${area.investmentScore}/100), family score (${area.familyScore}/100), rental demand, future growth, suggested colonies and expert recommendations.`;

  return {
    title,
    description,
    alternates: { canonical: getCanonical(`/areas/${slug}`) },
    openGraph: {
      title,
      description,
      url: `/areas/${slug}`,
      type: "website",
      images: area.featuredImage ? [{ url: area.featuredImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    keywords: [
      area.name,
      `property in ${area.name}`,
      `real estate ${area.name} Indore`,
      `plots in ${area.name}`,
      `investment in ${area.name}`,
      `${area.name} property price`,
      `best area in Indore`,
      `investment area in Indore`,
      ...(data.colonies.map((c) => c.colonyName)),
    ].filter(Boolean).join(", "),
  };
}

export default async function AreaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getAreaDetailData(slug);
  if (!data) notFound();

  const { area, colonies, relatedAreas } = data;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `${area.name}, Indore`,
    description: area.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Indore",
      addressRegion: "Madhya Pradesh",
      addressCountry: "IN",
    },
    geo: area.coordinates.lat
      ? { "@type": "GeoCoordinates", latitude: area.coordinates.lat, longitude: area.coordinates.lng }
      : undefined,
    image: area.featuredImage || undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: (area.investmentScore / 20).toFixed(1),
      bestRating: "5",
      ratingCount: area.viewCount || 1,
    },
  };

  return (
    <>
      <div className="space-y-12 md:space-y-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="transition-colors hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link href="/areas" className="transition-colors hover:text-brand-600">Areas</Link>
          <span>/</span>
          <span className="text-slate-600 font-medium">{area.name}</span>
        </nav>

        {/* Hero */}
        <AreaHero
          name={area.name}
          description={area.description}
          featuredImage={area.featuredImage}
          averagePrice={area.averagePrice}
          investmentScore={area.investmentScore}
          futureGrowth={area.futureGrowth}
          rentalDemand={area.rentalDemand}
          tags={area.tags ?? area.lifestyleTags ?? []}
          propertyTypes={area.propertyTypes}
        />

        {/* Why Recommended */}
        <WhyRecommendedSection
          investmentScore={area.investmentScore}
          familyScore={area.familyScore}
          rentalDemand={area.rentalDemand}
          futureGrowth={area.futureGrowth}
          trafficCondition={area.trafficCondition}
          pros={area.pros}
          budgetCategory={area.budgetCategory}
          tags={area.tags}
        />

        {/* Area Intelligence */}
        <AreaIntelligenceSection
          investmentScore={area.investmentScore}
          familyScore={area.familyScore}
          rentalDemand={area.rentalDemand}
          futureGrowth={area.futureGrowth}
          trafficScore={area.trafficScore}
          trafficCondition={area.trafficCondition}
        />

        {/* Suggested Colonies */}
        {colonies.length > 0 && (
          <SuggestedColoniesSection colonies={colonies} areaName={area.name} />
        )}

        {/* Lifestyle Match */}
        <LifestyleMatchSection
          familyScore={area.familyScore}
          investmentScore={area.investmentScore}
          rentalDemand={area.rentalDemand}
          tags={area.tags ?? area.lifestyleTags ?? []}
          propertyTypes={area.propertyTypes}
        />

        {/* Nearby Facilities */}
        <NearbyFacilitiesSection
          schools={area.nearbySchools}
          hospitals={area.nearbyHospitals}
          malls={area.nearbyMalls}
          itHubs={area.nearbyITHubs}
          nearbyMetro={area.nearbyMetro}
          connectivity={area.connectivity}
        />

        {/* Pros & Cons */}
        {(area.pros.length > 0 || area.cons.length > 0) && (
          <ProsConsSection pros={area.pros} cons={area.cons} />
        )}

        {/* Lead Form */}
        <div className="max-w-lg mx-auto w-full">
          <AreaLeadForm areaName={area.name} />
        </div>

        {/* Related Areas */}
        {relatedAreas.length > 0 && (
          <RelatedAreasSection areas={relatedAreas} currentSlug={area.slug} />
        )}
      </div>

      {/* WhatsApp Sticky CTA */}
      <WhatsAppStickyCTA areaName={area.name} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
