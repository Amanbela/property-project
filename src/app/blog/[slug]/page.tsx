import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { getBlogBySlug, getRelatedBlogs } from "@/infrastructure/seo/services/blog-service";
import { getTopInvestmentAreas } from "@/features/colony-intelligence/services/area-service";
import { getCanonical } from "@/lib/seo";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogRecommendationCTA } from "@/components/blog/BlogRecommendationCTA";
import { BlogWhatsAppCTA } from "@/components/blog/BlogWhatsAppCTA";
import { RelatedBlogsSection } from "@/components/blog/RelatedBlogsSection";
import { RelatedAreasSection } from "@/components/blog/RelatedAreasSection";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";

export const dynamic = "force-dynamic";

function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return {};

  const title = blog.seoTitle || `${blog.title} | Indore Property Area Intelligence`;
  const description = blog.seoDescription || blog.excerpt || `Read about ${blog.title} — area insights, investment tips, and property recommendations for Indore.`;
  const readTime = estimateReadTime(blog.content);

  return {
    title,
    description,
    alternates: { canonical: getCanonical(`/blog/${slug}`) },
    openGraph: {
      title,
      description,
      url: `/blog/${slug}`,
      type: "article",
      publishedTime: blog.createdAt,
      authors: ["Indore Property"],
      images: blog.featuredImage ? [{ url: blog.featuredImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    keywords: [...(blog.keywords || []), "Indore property", "real estate Indore", "area recommendation"].join(", "),
  };
}

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();

  const [related, topAreas] = await Promise.all([
    getRelatedBlogs(blog.relatedSlugs, slug),
    getTopInvestmentAreas(3),
  ]);

  const readTimeMinutes = estimateReadTime(blog.content);
  const hasFAQs = blog.faqs && blog.faqs.length > 0;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt || blog.seoDescription,
    image: blog.featuredImage || undefined,
    datePublished: blog.createdAt,
    author: { "@type": "Organization", name: "Indore Property" },
    publisher: { "@type": "Organization", name: "Indore Property" },
  };

  const faqSchema = hasFAQs
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: blog.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: getCanonical("/") },
      { "@type": "ListItem", position: 2, name: "Blog", item: getCanonical("/blog") },
      { "@type": "ListItem", position: 3, name: blog.title, item: getCanonical(`/blog/${slug}`) },
    ],
  };

  return (
    <>
      <ReadingProgressBar />

      <article className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/" className="transition-colors hover:text-brand-600">Home</Link>
          <ChevronRight size={12} />
          <Link href="/blog" className="transition-colors hover:text-brand-600">Blog</Link>
          <ChevronRight size={12} />
          <span className="text-slate-600 font-medium truncate">{blog.title}</span>
        </nav>

        {/* Hero */}
        <BlogHero
          title={blog.title}
          excerpt={blog.excerpt}
          featuredImage={blog.featuredImage}
          category={blog.category}
          createdAt={blog.createdAt || ""}
          readTimeMinutes={readTimeMinutes}
          keywords={blog.keywords || []}
        />

        {/* Article Content */}
        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 md:p-10 shadow-sm">
          <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-code:rounded-lg prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-blockquote:border-brand-500 prose-blockquote:bg-brand-50/50 prose-blockquote:py-1 prose-blockquote:not-italic prose-strong:text-slate-900 prose-h2:mt-10 prose-h3:mt-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.content}</ReactMarkdown>
          </div>

          {/* Article Footer */}
          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600"
            >
              <ArrowLeft size={14} />
              Back to Articles
            </Link>
            {blog.updatedAt && (
              <span className="text-xs text-slate-400">
                Last updated {new Date(blog.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            )}
          </div>
        </section>

        {/* Recommendation CTA */}
        <section className="mt-8">
          <BlogRecommendationCTA />
        </section>

        {/* Related Areas */}
        {topAreas.length > 0 && (
          <section className="mt-12">
            <RelatedAreasSection areas={topAreas} />
          </section>
        )}

        {/* Related Blogs */}
        {related.length > 0 && (
          <section className="mt-12">
            <RelatedBlogsSection blogs={related} currentSlug={slug} />
          </section>
        )}

        {/* FAQ Section */}
        {hasFAQs && (
          <section className="mt-12 mx-auto max-w-2xl">
            <h2 className="heading-lg mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {blog.faqs.map((faq, i) => (
                <details key={i} className="card-base group cursor-pointer">
                  <summary className="flex items-center justify-between font-semibold text-slate-800 list-none text-sm md:text-base">
                    {faq.question}
                    <ChevronRight size={16} className="flex-shrink-0 text-slate-400 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm text-body border-t border-slate-100 pt-3">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Back to top */}
        <div className="mt-10 text-center">
          <a href="#" className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-brand-600 transition-colors">
            ↑ Back to top
          </a>
        </div>
      </article>

      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* WhatsApp Sticky CTA */}
      <BlogWhatsAppCTA blogTitle={blog.title} blogSlug={blog.slug} />
    </>
  );
}
