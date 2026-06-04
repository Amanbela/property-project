import Link from "next/link";
import { getComparisons } from "@/actions/admin-comparisons";
import { ComparisonListClient } from "./ComparisonListClient";

export default async function AdminComparisonsPage() {
  const comparisons = await getComparisons();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Comparisons</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/comparisons/create"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-slate-900"
          >
            Create comparison
          </Link>
        </div>
      </div>

      <ComparisonListClient
        comparisons={JSON.parse(JSON.stringify(comparisons))}
      />
    </div>
  );
}
