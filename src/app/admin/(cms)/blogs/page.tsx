import React from "react";
import { listBlogsAdmin } from "@/infrastructure/seo/services/blog-service";
import { BlogListClient } from "./BlogListClient";

export default async function AdminBlogsPage() {
  const { items } = await listBlogsAdmin({ status: "all" });

  return (
    <div className="space-y-6">
      <BlogListClient initialData={JSON.parse(JSON.stringify(items))} />
    </div>
  );
}
