import Link from "next/link";
import { listAreasAdmin } from "@/features/colony-intelligence/services/area-service";
import { DeleteAreaButton } from "@/components/admin/DeleteAreaButton";

export default async function AdminAreasPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; page?: string; published?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const page = Number(sp.page) || 1;
  const pub = sp.published === "true" ? true : sp.published === "false" ? false : null;
  const { items, total, pageSize } = await listAreasAdmin({ page, search: q, publishedOnly: pub });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Areas</h1>
        <Link href="/admin/areas/create" className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-slate-900">
          Create area
        </Link>
      </div>
      <form method="get" action="/admin/areas" className="glass-panel flex flex-wrap gap-2 rounded-2xl p-4">
        <input name="q" defaultValue={q} placeholder="Search…" className="focus-ring rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        <select name="published" defaultValue={sp.published ?? ""} className="focus-ring rounded-xl border px-3 py-2 text-sm dark:bg-slate-950">
          <option value="">All</option>
          <option value="true">Published</option>
          <option value="false">Unpublished</option>
        </select>
        <button type="submit" className="rounded-full border px-4 py-2 text-sm">
          Filter
        </button>
      </form>
      <p className="text-sm text-slate-500">
        {total} total · page {page} of {Math.max(1, Math.ceil(total / pageSize))}
      </p>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100/80 dark:bg-slate-900/80">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Published</th>
              <th className="p-3">Views</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="border-t border-slate-200 dark:border-slate-800">
                <td className="p-3 font-medium">{a.name}</td>
                <td className="p-3">{a.slug}</td>
                <td className="p-3">{a.published ? "Yes" : "No"}</td>
                <td className="p-3">{a.viewCount}</td>
                <td className="p-3 text-right">
                  <Link href={`/admin/areas/edit/${a.id}`} className="text-blue-600">
                    Edit
                  </Link>
                  <DeleteAreaButton id={a.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
