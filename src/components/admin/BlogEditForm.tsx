"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { autosaveBlogDraft, updateBlog } from "@/actions/admin-blogs";
import type { BlogDoc } from "@/infrastructure/seo/services/blog-service";
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

export function BlogEditForm({ blog }: { blog: BlogDoc }) {
  const bound = updateBlog.bind(null, blog.id);
  const [state, formAction] = useFormState(bound, initial);
  const [liveContent, setLiveContent] = useState(blog.content);

  useEffect(() => {
    const id = window.setInterval(() => {
      void autosaveBlogDraft(blog.id, liveContent);
    }, 30000);
    return () => window.clearInterval(id);
  }, [blog.id, liveContent]);

  return (
    <form action={formAction} className="glass-panel space-y-4 rounded-3xl p-6">
      <input type="hidden" name="content" value={liveContent} readOnly />
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm">
          Title *
          <input name="title" required defaultValue={blog.title} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          Slug
          <input name="slug" defaultValue={blog.slug} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="col-span-full text-sm">
          Excerpt
          <textarea name="excerpt" rows={2} defaultValue={blog.excerpt} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <BlogMarkdownTabs value={liveContent} onValueChange={setLiveContent} initialContent={blog.content} />
        <label className="text-sm">
          Category
          <input name="category" defaultValue={blog.category} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          Status
          <select name="status" defaultValue={blog.status} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <label className="text-sm">
          Schema type
          <input name="schemaType" defaultValue={blog.schemaType} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="col-span-full text-sm">
          Keywords (comma-separated)
          <input name="keywordsCsv" defaultValue={blog.keywords.join(", ")} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="col-span-full text-sm">
          Related post slugs (comma-separated)
          <input name="relatedSlugsCsv" defaultValue={blog.relatedSlugs.join(", ")} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          Featured image URL
          <input name="featuredImage" defaultValue={blog.featuredImage} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          SEO title
          <input name="seoTitle" defaultValue={blog.seoTitle} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          SEO description
          <input name="seoDescription" defaultValue={blog.seoDescription} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
      </div>
      <SubmitButton label="Save blog" />
      {state?.ok === true && <p className="text-sm text-green-600">Saved.</p>}
      {state?.error && <p className="text-sm text-red-600">{typeof state.error === "string" ? state.error : JSON.stringify(state.error)}</p>}
      <p className="text-xs text-slate-500">Draft content autosaves to the server every 30 seconds.</p>
    </form>
  );
}
