import Link from "next/link";
import { listSeoPagesAdmin } from "@/infrastructure/seo/services/seo-page-service";
import { DeleteSeoPageButton } from "@/components/admin/DeleteSeoPageButton";

export default async function AdminSeoPagesList({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const page = Number(sp.page) || 1;
  const { items, total, pageSize } = await listSeoPagesAdmin({ page, search: q });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">SEO pages</h1>
        <Link href="/admin/seo-pages/create" className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-slate-900">
          Create SEO page
        </Link>
      </div>
      <form method="get" action="/admin/seo-pages" className="glass-panel flex flex-wrap gap-2 rounded-2xl p-4">
        <input name="q" defaultValue={q} placeholder="Search…" className="focus-ring rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        <button type="submit" className="rounded-full border px-4 py-2 text-sm">
          Search
        </button>
      </form>
      <p className="text-sm text-slate-500">
        {total} pages · page {page} of {Math.max(1, Math.ceil(total / pageSize))}
      </p>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100/80 dark:bg-slate-900/80">
            <tr>
              <th className="p-3">H1</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Published</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t border-slate-200 dark:border-slate-800">
                <td className="p-3 font-medium">{p.h1}</td>
                <td className="p-3">{p.slug}</td>
                <td className="p-3">{p.published ? "Yes" : "No"}</td>
                <td className="p-3 text-right">
                  <Link href={`/admin/seo-pages/edit/${p.id}`} className="text-blue-600">
                    Edit
                  </Link>
                  <DeleteSeoPageButton id={p.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
