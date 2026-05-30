import { getSiteSettings } from "@/infrastructure/db/services/site-settings-service";
import { regenerateSitemapNote, updateSiteSettings } from "@/actions/admin-settings";

export default async function AdminSettingsPage() {
  const s = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-3xl p-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Global SEO, robots overrides, canonical base, and recommendation weights (JSON).</p>
      </div>
      <form action={updateSiteSettings} className="glass-panel space-y-3 rounded-3xl p-6">
        <label className="block text-sm">
          Default SEO title
          <input name="defaultSeoTitle" defaultValue={s.defaultSeoTitle ?? ""} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="block text-sm">
          Default SEO description
          <textarea name="defaultSeoDescription" rows={3} defaultValue={s.defaultSeoDescription ?? ""} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="block text-sm">
          Canonical base URL
          <input name="canonicalBaseUrl" defaultValue={s.canonicalBaseUrl ?? ""} placeholder="https://yourdomain.com" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="block text-sm">
          robots.txt override (optional)
          <textarea name="robotsTxtOverride" rows={6} defaultValue={s.robotsTxtOverride ?? ""} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs dark:bg-slate-950" />
        </label>
        <label className="block text-sm">
          Recommendation weights JSON (optional, partial per purpose)
          <textarea name="recommendationWeightsJson" rows={10} defaultValue={s.recommendationWeightsJson ?? ""} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs dark:bg-slate-950" />
        </label>
        <button type="submit" className="rounded-full bg-slate-900 px-5 py-2 text-sm text-white dark:bg-white dark:text-slate-900">
          Save settings
        </button>
      </form>
      <form action={regenerateSitemapNote} className="glass-panel rounded-2xl p-4">
        <p className="text-sm text-slate-600 dark:text-slate-300">Trigger sitemap revalidation after publishing content.</p>
        <button type="submit" className="mt-2 rounded-full border px-4 py-2 text-sm">
          Regenerate sitemap cache
        </button>
      </form>
      <div className="glass-panel rounded-2xl p-4 text-sm text-slate-600 dark:text-slate-300">
        <p className="font-medium text-slate-900 dark:text-slate-100">Metadata preview</p>
        <p className="mt-2 text-blue-700 dark:text-blue-300">{s.defaultSeoTitle || "Indore Property Budget Finder"}</p>
        <p className="mt-1">{s.defaultSeoDescription || "Property intelligence for Indore."}</p>
      </div>
    </div>
  );
}
