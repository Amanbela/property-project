import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedSeoPages, getSeoPageBySlug } from "@/infrastructure/seo/services/seo-page-service";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getSeoPageBySlug(slug);
  if (!guide) return {};
  return {
    title: guide.seoTitle,
    description: guide.metaDescription,
    openGraph: { title: guide.seoTitle, description: guide.metaDescription, type: "article", url: `/guides/${guide.slug}` },
    twitter: { card: "summary_large_image", title: guide.seoTitle, description: guide.metaDescription },
    alternates: { canonical: `/guides/${guide.slug}` }
  };
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getSeoPageBySlug(slug);
  if (!guide) notFound();

  const all = await getPublishedSeoPages();
  const related = all.filter((item) => item.slug !== guide.slug).slice(0, 3);

  let faqSchema: Record<string, unknown>;
  let articleSchema: Record<string, unknown>;
  try {
    faqSchema = guide.faqSchemaJson ? JSON.parse(guide.faqSchemaJson) : buildFaq(guide);
    articleSchema = guide.articleSchemaJson ? JSON.parse(guide.articleSchemaJson) : buildArticle(guide);
  } catch {
    faqSchema = buildFaq(guide);
    articleSchema = buildArticle(guide);
  }

  return (
    <article className="space-y-8 pb-8">
      <header className="glass-panel rounded-3xl p-6 md:p-8">
        <nav className="text-sm text-slate-600 dark:text-slate-300">
          <Link href="/">Home</Link> / <Link href="/guides">Guides</Link> / {guide.h1}
        </nav>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{guide.h1}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base dark:text-slate-300">{guide.intro}</p>
      </header>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">Detailed Analysis</h2>
        {guide.sections.map((section) => (
          <div key={section.heading} className="glass-panel rounded-2xl p-5">
            <h3 className="text-xl font-semibold tracking-tight">{section.heading}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 md:text-base dark:text-slate-300">{section.content}</p>
          </div>
        ))}
      </section>

      <section className="glass-panel rounded-2xl p-5">
        <h2 className="text-xl font-semibold tracking-tight">Internal Links for Further Research</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link href="/areas" className="rounded-full border border-slate-300 px-3 py-1.5 hover:border-blue-500 hover:text-blue-600 dark:border-slate-700">
            Explore all Indore areas
          </Link>
          <Link href="/blog" className="rounded-full border border-slate-300 px-3 py-1.5 hover:border-blue-500 hover:text-blue-600 dark:border-slate-700">
            Read market blog
          </Link>
          <Link href="/insights/best-investment-areas-in-indore" className="rounded-full border border-slate-300 px-3 py-1.5 hover:border-blue-500 hover:text-blue-600 dark:border-slate-700">
            Investment insights page
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">FAQs</h2>
        {guide.faqs.map((faq) => (
          <details key={faq.q} className="glass-panel rounded-2xl p-5">
            <summary className="cursor-pointer text-base font-medium">{faq.q}</summary>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{faq.a}</p>
          </details>
        ))}
      </section>

      <section className="glass-panel rounded-2xl p-5">
        <h2 className="text-xl font-semibold tracking-tight">Related Long-Tail Guides</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {related.map((item) => (
            <Link key={item.slug} href={`/guides/${item.slug}`} className="rounded-xl border border-slate-300 p-3 text-sm hover:border-blue-500 hover:text-blue-600 dark:border-slate-700">
              {item.h1}
            </Link>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </article>
  );
}

function buildFaq(guide: { faqs: { q: string; a: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a }
    }))
  };
}

function buildArticle(guide: { seoTitle: string; metaDescription: string; keyword: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.seoTitle,
    description: guide.metaDescription,
    about: guide.keyword,
    author: { "@type": "Organization", name: "Indore Property Budget Finder" },
    publisher: { "@type": "Organization", name: "Indore Property Budget Finder" }
  };
}
