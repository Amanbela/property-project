import { updateSeoPage } from "@/actions/admin-seo-pages";
import type { SeoPageDoc } from "@/infrastructure/seo/services/seo-page-service";

export function SeoPageEditForm({ page }: { page: SeoPageDoc }) {
  const action = updateSeoPage.bind(null, page.id);

  return (
    <form action={action} className="glass-panel space-y-3 rounded-3xl p-6">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm">
          Slug *
          <input name="slug" required defaultValue={page.slug} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          H1 *
          <input name="h1" required defaultValue={page.h1} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          SEO title *
          <input name="seoTitle" required defaultValue={page.seoTitle} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          Keyword
          <input name="keyword" defaultValue={page.keyword} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="col-span-full text-sm">
          Meta description *
          <textarea name="metaDescription" required rows={3} defaultValue={page.metaDescription} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="col-span-full text-sm">
          Intro
          <textarea name="intro" rows={3} defaultValue={page.intro} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="col-span-full text-sm">
          Sections JSON *
          <textarea name="sectionsJson" required rows={10} defaultValue={JSON.stringify(page.sections, null, 2)} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs dark:bg-slate-950" />
        </label>
        <label className="col-span-full text-sm">
          FAQs JSON *
          <textarea name="faqsJson" required rows={8} defaultValue={JSON.stringify(page.faqs, null, 2)} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs dark:bg-slate-950" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={page.published} /> Published
        </label>
        <label className="col-span-full text-sm">
          Article JSON-LD (optional)
          <textarea name="articleSchemaJson" rows={4} defaultValue={page.articleSchemaJson ?? ""} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs dark:bg-slate-950" />
        </label>
        <label className="col-span-full text-sm">
          FAQ JSON-LD (optional)
          <textarea name="faqSchemaJson" rows={4} defaultValue={page.faqSchemaJson ?? ""} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs dark:bg-slate-950" />
        </label>
      </div>
      <button type="submit" className="rounded-full bg-slate-900 px-5 py-2 text-sm text-white dark:bg-white dark:text-slate-900">
        Save
      </button>
    </form>
  );
}
