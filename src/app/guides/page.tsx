import Link from "next/link";
import { getPublishedSeoPages } from "@/infrastructure/seo/services/seo-page-service";

export const dynamic = "force-dynamic";

export default async function GuidesListingPage() {
  const guides = await getPublishedSeoPages();

  return (
    <div className="space-y-6 pb-8">
      <div className="glass-panel rounded-3xl p-6 md:p-8">
        <h1 className="heading-xl">Indore Real Estate Guides</h1>
        <p className="mt-3 text-sm text-slate-600 md:text-base dark:text-slate-300">SEO-focused long-tail guides for budget buyers, families, rental investors, and growth-focused property seekers.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {guides.map((guide) => (
          <article key={guide.slug} className="glass-panel rounded-2xl p-5">
            <h2 className="text-lg font-semibold tracking-tight">{guide.h1}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{guide.metaDescription}</p>
            <Link href={`/guides/${guide.slug}`} className="mt-4 inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm transition hover:border-blue-500 hover:text-blue-600 dark:border-slate-700">
              Read guide
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
