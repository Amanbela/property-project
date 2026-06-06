import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogBySlugAdmin, getBlogById } from "@/infrastructure/seo/services/blog-service";
import { BlogEditForm } from "@/components/admin/BlogEditForm";

async function loadBlog(param: string) {
  if (/^[a-f0-9]{24}$/i.test(param)) {
    return getBlogById(param);
  }
  return getBlogBySlugAdmin(param);
}

export default async function AdminBlogEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  console.log("Edit Blog Params:", { slug });

  const blog = await loadBlog(slug).catch((err) => {
    console.error("Failed to load blog for edit:", err);
    return null;
  });

  if (!blog) notFound();

  return (
    <div className="space-y-4">
      <Link href="/admin/blogs" className="text-sm text-blue-600">
        ← Blogs
      </Link>
      <h1 className="text-2xl font-semibold">Edit {blog.title}</h1>
      <BlogEditForm blog={blog} />
    </div>
  );
}
