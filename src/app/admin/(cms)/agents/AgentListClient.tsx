"use client";

import React from "react";
import { AdminDataTable } from "@/components/admin/DataTable";
import { Agent } from "@/shared/types/models";
import { deleteAgent } from "@/actions/admin-agents";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AgentListClient({ initialData }: { initialData: Agent[] }) {
  const router = useRouter();

  const columns = [
    { 
      header: "Agent Name", 
      accessor: "name" as keyof Agent,
      className: "font-semibold text-slate-900"
    },
    { header: "Phone", accessor: "phone" as keyof Agent },
    { 
      header: "Status", 
      accessor: (item: Agent) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.verifiedStatus === "verified" ? "bg-green-100 text-green-700" : 
          item.verifiedStatus === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
        }`}>
          {item.verifiedStatus.charAt(0).toUpperCase() + item.verifiedStatus.slice(1)}
        </span>
      )
    },
    { 
      header: "Rating", 
      accessor: (item: Agent) => (
        <span className="flex items-center gap-1 font-bold text-slate-700">
          ⭐ {item.rating}
        </span>
      )
    },
    { 
      header: "Specialization", 
      accessor: (item: Agent) => item.specializationAreas.join(", ") 
    },
  ];

  const handleDelete = async (item: Agent) => {
    if (confirm(`Are you sure you want to delete agent ${item.name}?`)) {
      const res = await deleteAgent(item._id!);
      if (res.ok) {
        toast.success("Agent deleted successfully");
        router.refresh();
      } else {
        toast.error("Failed to delete agent");
      }
    }
  };

  return (
    <AdminDataTable
      title="Agents"
      data={initialData}
      columns={columns}
      createLink="/admin/agents/create"
      onEdit={(item) => router.push(`/admin/agents/${item._id}/edit`)}
      onDelete={handleDelete}
    />
  );
}
