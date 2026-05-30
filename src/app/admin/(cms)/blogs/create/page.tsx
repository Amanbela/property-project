import Link from "next/link";
import { BlogCreateForm } from "@/components/admin/BlogCreateForm";

export default function AdminBlogCreatePage() {
  return (
    <div className="space-y-4">
      <Link href="/admin/blogs" className="text-sm text-blue-600">
        ← Blogs
      </Link>
      <h1 className="text-2xl font-semibold">Create blog</h1>
      <BlogCreateForm />
    </div>
  );
}
