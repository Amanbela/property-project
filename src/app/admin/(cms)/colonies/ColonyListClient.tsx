"use client";

import React from "react";
import { AdminDataTable } from "@/components/admin/DataTable";
import { Colony } from "@/shared/types/models";
import { deleteColony } from "@/actions/admin-colonies";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ColonyListClient({ initialData }: { initialData: Colony[] }) {
  const router = useRouter();

  const columns = [
    { 
      header: "Colony Name", 
      accessor: "colonyName" as keyof Colony,
      className: "font-semibold text-slate-900"
    },
    { header: "Area", accessor: "areaName" as keyof Colony },
    { 
      header: "Status", 
      accessor: (item: Colony) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.published ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
        }`}>
          {item.published ? "Published" : "Draft"}
        </span>
      )
    },
    { 
      header: "Scores", 
      accessor: (item: Colony) => (
        <div className="flex gap-2">
          <span title="Investment" className="text-xs px-1.5 py-0.5 bg-brand-50 text-brand-600 rounded">I: {item.investmentScore}</span>
          <span title="Family" className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">F: {item.familyScore}</span>
        </div>
      )
    },
    { 
      header: "RERA", 
      accessor: (item: Colony) => item.reraStatus ? "✅" : "❌" 
    },
  ];

  const handleDelete = async (item: Colony) => {
    if (confirm(`Are you sure you want to delete ${item.colonyName}?`)) {
      const res = await deleteColony(item._id!);
      if (res.ok) {
        toast.success("Colony deleted successfully");
        router.refresh();
      } else {
        toast.error("Failed to delete colony");
      }
    }
  };

  return (
    <AdminDataTable
      title="Colonies"
      data={initialData}
      columns={columns}
      createLink="/admin/colonies/create"
      onEdit={(item) => router.push(`/admin/colonies/${item._id}/edit`)}
      onDelete={handleDelete}
      onView={(item) => window.open(`/colonies/${item.slug}`, "_blank")}
    />
  );
}
