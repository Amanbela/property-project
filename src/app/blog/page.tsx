import { getPublishedBlogs } from "@/infrastructure/seo/services/blog-service";
import { BlogCard } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const blogs = await getPublishedBlogs();

  return (
    <div>
      <h1 className="text-3xl font-bold">Indore Property Insights Blog</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">SEO-focused articles around investment, budget and family-friendly areas.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard key={blog.slug} title={blog.title} excerpt={blog.excerpt} slug={blog.slug} />
        ))}
      </div>
    </div>
  );
}
