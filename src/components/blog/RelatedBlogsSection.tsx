import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import type { BlogDoc } from "@/infrastructure/seo/services/blog-service";

interface Props {
  blogs: BlogDoc[];
  currentSlug: string;
}

export function RelatedBlogsSection({ blogs, currentSlug }: Props) {
  const filtered = blogs.filter((b) => b.slug !== currentSlug).slice(0, 3);

  if (filtered.length === 0) return null;

  return (
    <section>
      <h2 className="heading-md mb-6 text-slate-900">Related Articles</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((blog) => (
          <Link
            key={blog.slug}
            href={`/blog/${blog.slug}`}
            className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-brand-200 hover:shadow-md"
          >
            {blog.featuredImage && (
              <div className="mb-3 h-36 overflow-hidden rounded-xl bg-slate-100">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              {blog.category && (
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-600">
                  {blog.category}
                </span>
              )}
              {blog.createdAt && (
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock size={10} />
                  {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
              )}
            </div>
            <h3 className="font-display text-sm font-bold text-slate-900 leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">
              {blog.title}
            </h3>
            <p className="mt-1 text-xs text-slate-500 line-clamp-2">{blog.excerpt}</p>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Read Article <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
