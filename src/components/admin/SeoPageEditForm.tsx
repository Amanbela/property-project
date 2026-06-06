"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateSeoPage } from "@/actions/admin-seo-pages";
import type { SeoPageDoc } from "@/infrastructure/seo/services/seo-page-service";

type FormState = { ok?: boolean; error?: string | Record<string, string[]> } | null;
const initial: FormState = null;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-slate-900">
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

export function SeoPageEditForm({ page }: { page: SeoPageDoc }) {
  const bound = updateSeoPage.bind(null, page.id);
  const [state, formAction] = useFormState(bound, initial);

  return (
    <form action={formAction} className="glass-panel space-y-3 rounded-3xl p-6">
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
      <SubmitButton />
      {state?.ok === true && <p className="text-sm text-green-600">Saved.</p>}
      {state?.error && <p className="text-sm text-red-600">{typeof state.error === "string" ? state.error : JSON.stringify(state.error)}</p>}
    </form>
  );
}
