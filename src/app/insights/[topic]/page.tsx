import { notFound } from "next/navigation";
import { getPublishedAreas, mapAreaDocToArea } from "@/features/colony-intelligence/services/area-service";
import { AreaCard } from "@/components/ui";

const topics: Record<string, string> = {
  "best-areas-in-indore": "Best areas in Indore",
  "affordable-areas-in-indore": "Affordable areas in Indore",
  "luxury-property-areas": "Luxury property areas",
  "best-investment-areas-in-indore": "Best investment areas in Indore",
  "family-friendly-locations-in-indore": "Family-friendly locations in Indore",
  "high-rental-demand-areas": "High rental demand areas"
};

export const dynamic = "force-dynamic";

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const title = topics[topic];
  if (!title) notFound();
  const docs = await getPublishedAreas(12);
  const areas = docs.map(mapAreaDocToArea);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p>Curated SEO landing page for {title.toLowerCase()} based on score-driven local intelligence.</p>
      <div className="grid gap-3 md:grid-cols-2">
        {areas.slice(0, 4).map((a) => (
          <AreaCard key={a.slug} area={a} />
        ))}
      </div>
    </div>
  );
}
