"use client";

import React from "react";
import { AdminDataTable } from "@/components/admin/DataTable";
import { Builder } from "@/shared/types/models";
import { deleteBuilder } from "@/actions/admin-builders";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function BuilderListClient({ initialData }: { initialData: Builder[] }) {
  const router = useRouter();

  const columns = [
    { 
      header: "Builder Name", 
      accessor: "builderName" as keyof Builder,
      className: "font-semibold text-slate-900"
    },
    { 
      header: "Score", 
      accessor: (item: Builder) => (
        <span className="px-2 py-1 bg-brand-50 text-brand-600 rounded-lg text-xs font-bold">
          {item.reputationScore}/10
        </span>
      )
    },
    { 
      header: "Projects", 
      accessor: (item: Builder) => (
        <span className="text-xs text-slate-500">
          {item.completedProjects} Completed · {item.ongoingProjects} Ongoing
        </span>
      )
    },
    { 
      header: "Status", 
      accessor: (item: Builder) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.activeStatus ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
        }`}>
          {item.activeStatus ? "Active" : "Inactive"}
        </span>
      )
    },
    { 
      header: "RERA", 
      accessor: (item: Builder) => item.reraVerified ? "✅ Verified" : "❌ No" 
    },
  ];

  const handleDelete = async (item: Builder) => {
    if (confirm(`Are you sure you want to delete ${item.builderName}?`)) {
      const res = await deleteBuilder(item._id!);
      if (res.ok) {
        toast.success("Builder deleted successfully");
        router.refresh();
      } else {
        toast.error("Failed to delete builder");
      }
    }
  };

  return (
    <AdminDataTable
      title="Builders"
      data={initialData}
      columns={columns}
      createLink="/admin/builders/create"
      onEdit={(item) => router.push(`/admin/builders/${item._id}/edit`)}
      onDelete={handleDelete}
    />
  );
}
