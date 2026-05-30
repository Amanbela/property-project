"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createBlog } from "@/actions/admin-blogs";
import { BlogMarkdownTabs } from "@/components/admin/BlogMarkdownTabs";

type FormState = { ok?: boolean; error?: string | Record<string, string[]> };
const initial: FormState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-slate-900">
      {pending ? "Saving…" : label}
    </button>
  );
}

export function BlogCreateForm() {
  const [state, formAction] = useFormState(createBlog, initial);

  return (
    <form action={formAction} className="glass-panel space-y-4 rounded-3xl p-6">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm">
          Title *
          <input name="title" required className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          Slug (optional)
          <input name="slug" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="col-span-full text-sm">
          Excerpt
          <textarea name="excerpt" rows={2} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <BlogMarkdownTabs />
        <label className="text-sm">
          Category
          <input name="category" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          Status
          <select name="status" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <label className="text-sm">
          Schema type
          <input name="schemaType" defaultValue="Article" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="col-span-full text-sm">
          Keywords (comma-separated)
          <input name="keywordsCsv" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="col-span-full text-sm">
          Related post slugs (comma-separated)
          <input name="relatedSlugsCsv" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          Featured image URL
          <input name="featuredImage" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          SEO title
          <input name="seoTitle" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          SEO description
          <input name="seoDescription" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
      </div>
      <SubmitButton label="Create blog" />
      {state?.ok === true && <p className="text-sm text-green-600">Created.</p>}
      {state?.error && <p className="text-sm text-red-600">{typeof state.error === "string" ? state.error : JSON.stringify(state.error)}</p>}
    </form>
  );
}
