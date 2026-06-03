import Link from "next/link";
import { getBudgetRanges } from "@/actions/admin-budget-ranges";
import { DeleteBudgetRangeButton } from "@/components/admin/DeleteBudgetRangeButton";

function formatLabel(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(0)} L`;
  return `₹${price.toLocaleString()}`;
}

function formatPriceRange(min: number, max: number): string {
  const minStr = formatLabel(min);
  const maxStr = max >= 999999999 ? "Above" : formatLabel(max);
  return max >= 999999999 ? `${maxStr} ${minStr}` : `${minStr} – ${maxStr}`;
}

export default async function AdminBudgetRangesPage() {
  const ranges = await getBudgetRanges();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Budget Ranges</h1>
        <Link href="/admin/budget-ranges/create" className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-slate-900">
          Create budget range
        </Link>
      </div>
      <p className="text-sm text-slate-500">
        {ranges.length} total
      </p>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100/80 dark:bg-slate-900/80">
            <tr>
              <th className="p-3">Label</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Price Range</th>
              <th className="p-3">Areas</th>
              <th className="p-3">Active</th>
              <th className="p-3">Sort</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {ranges.map((r) => (
              <tr key={r._id} className="border-t border-slate-200 dark:border-slate-800">
                <td className="p-3 font-medium">{r.label}</td>
                <td className="p-3">{r.slug}</td>
                <td className="p-3">{formatPriceRange(r.minPrice, r.maxPrice)}</td>
                <td className="p-3">{Array.isArray(r.recommendedAreas) ? r.recommendedAreas.length : 0}</td>
                <td className="p-3">{r.isActive ? "Yes" : "No"}</td>
                <td className="p-3">{r.sortOrder}</td>
                <td className="p-3 text-right">
                  <Link href={`/admin/budget-ranges/${r._id}/edit`} className="text-blue-600">
                    Edit
                  </Link>
                  <DeleteBudgetRangeButton id={r._id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
