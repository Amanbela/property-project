import { createSeoPage } from "@/actions/admin-seo-pages";

export function SeoPageCreateForm() {
  return (
    <form action={createSeoPage} className="glass-panel space-y-3 rounded-3xl p-6">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm">
          Slug *
          <input name="slug" required className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          H1 *
          <input name="h1" required className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          SEO title *
          <input name="seoTitle" required className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          Keyword
          <input name="keyword" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="col-span-full text-sm">
          Meta description *
          <textarea name="metaDescription" required rows={3} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="col-span-full text-sm">
          Intro
          <textarea name="intro" rows={3} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="col-span-full text-sm">
          Sections JSON *
          <textarea
            name="sectionsJson"
            required
            rows={10}
            defaultValue={JSON.stringify([{ heading: "Overview", content: "Add your first section here." }], null, 2)}
            className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs dark:bg-slate-950"
          />
        </label>
        <label className="col-span-full text-sm">
          FAQs JSON *
          <textarea
            name="faqsJson"
            required
            rows={8}
            defaultValue={JSON.stringify([{ q: "Example question?", a: "Example answer." }], null, 2)}
            className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs dark:bg-slate-950"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked /> Published
        </label>
        <label className="col-span-full text-sm">
          Article JSON-LD (optional)
          <textarea name="articleSchemaJson" rows={4} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs dark:bg-slate-950" />
        </label>
        <label className="col-span-full text-sm">
          FAQ JSON-LD (optional)
          <textarea name="faqSchemaJson" rows={4} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs dark:bg-slate-950" />
        </label>
      </div>
      <button type="submit" className="rounded-full bg-slate-900 px-5 py-2 text-sm text-white dark:bg-white dark:text-slate-900">
        Create
      </button>
    </form>
  );
}
