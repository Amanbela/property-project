"use client";

import { useTransition } from "react";
import { deleteBlog } from "@/actions/admin-blogs";

export function DeleteBlogButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="ml-3 text-sm text-red-600 disabled:opacity-50"
      onClick={() => {
        if (!confirm("Delete this blog?")) return;
        start(async () => {
          await deleteBlog(id);
          window.location.href = "/admin/blogs";
        });
      }}
    >
      Delete
    </button>
  );
}
