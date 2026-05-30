import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogById } from "@/infrastructure/seo/services/blog-service";
import { BlogEditForm } from "@/components/admin/BlogEditForm";

export default async function AdminBlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await getBlogById(id);
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
