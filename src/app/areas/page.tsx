import { getPublishedAreas, mapAreaDocToArea } from "@/features/colony-intelligence/services/area-service";
import { AreaExplorer } from "@/components/AreaExplorer";

export const dynamic = "force-dynamic";

export default async function AreasPage() {
  const docs = await getPublishedAreas(200);
  const areas = docs.map(mapAreaDocToArea);

  return (
    <div className="pb-8">
      <div className="glass-panel rounded-3xl p-6 md:p-8">
        <h1 className="heading-xl">Areas in Indore</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base dark:text-slate-300">Searchable and filter-ready area intelligence for property decisions.</p>
      </div>
      <AreaExplorer areas={areas} />
    </div>
  );
}
