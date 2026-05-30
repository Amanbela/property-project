"use client";

import React from "react";
import { AdminDataTable } from "@/components/admin/DataTable";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Blog } from "@/shared/types/models";

export function BlogListClient({ initialData }: { initialData: Blog[] }) {
  const router = useRouter();

  const columns = [
    { 
      header: "Title", 
      accessor: "title",
      className: "font-semibold text-slate-900"
    },
    { header: "Category", accessor: "category" },
    { 
      header: "Status", 
      accessor: (item: Blog) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.status === "published" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
        }`}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      )
    },
    { 
      header: "Last Updated", 
      accessor: (item: Blog) => item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "N/A"
    },
  ];

  return (
    <AdminDataTable
      title="Articles"
      data={initialData}
      columns={columns}
      createLink="/admin/blogs/create"
      onEdit={(item) => router.push(`/admin/blogs/edit/${item.slug}`)}
      onDelete={(item) => toast.error("Delete restricted for safety")}
      onView={(item) => window.open(`/blog/${item.slug}`, "_blank")}
    />
  );
}
