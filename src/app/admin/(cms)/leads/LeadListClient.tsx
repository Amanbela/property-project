"use client";

import React, { useTransition } from "react";
import { AdminDataTable } from "@/components/admin/DataTable";
import { Lead } from "@/shared/types/models";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Phone, Mail, Calendar, Download } from "lucide-react";
import { updateLeadStatus } from "@/actions/admin-leads";

export function LeadListClient({ initialData }: { initialData: Lead[] }) {
  const router = useRouter();

  const columns = [
    { 
      header: "Lead Info", 
      accessor: (item: Lead) => (
        <div className="space-y-1">
          <p className="font-bold text-slate-900">{item.name}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1"><Phone size={10} /> {item.phone}</p>
        </div>
      )
    },
    { 
      header: "Requirement", 
      accessor: (item: Lead) => (
        <div className="text-xs space-y-0.5">
          <p><span className="text-slate-400">Area:</span> {item.preferredArea || "N/A"}</p>
          <p><span className="text-slate-400">Budget:</span> ₹{item.budget?.toLocaleString() || "N/A"}</p>
        </div>
      )
    },
    { 
      header: "Status", 
      accessor: (item: Lead) => (
        <select 
          defaultValue={item.status}
          className={`text-xs font-bold px-2 py-1 rounded-lg border-none focus:ring-2 focus:ring-brand-500/20 ${
            item.status === "new" ? "bg-blue-100 text-blue-700" :
            item.status === "contacted" ? "bg-yellow-100 text-yellow-700" :
            item.status === "interested" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"
          }`}
          onChange={async (e) => {
            if (!item._id) return;
            const res = await updateLeadStatus({ id: item._id, status: e.target.value as Lead["status"] });
            if (res.ok) {
              toast.success(`Updated ${item.name} to ${e.target.value}`);
            } else {
              toast.error(res.error || "Failed to update status");
            }
          }}
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="interested">Interested</option>
          <option value="closed">Closed</option>
        </select>
      )
    },
    { 
      header: "Date", 
      accessor: (item: Lead) => (
        <p className="text-xs text-slate-500 flex items-center gap-1">
          <Calendar size={12} /> {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
        </p>
      )
    },
  ];

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Name,Phone,Area,Budget,Status,Date"].join(",") + "\n"
      + initialData.map(l => `${l.name},${l.phone},${l.preferredArea},${l.budget},${l.status},${l.createdAt}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "property_leads.csv");
    document.body.appendChild(link);
    link.click();
    toast.success("Leads exported to CSV");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm"
        >
          <Download size={18} /> Export Leads
        </button>
      </div>
      <AdminDataTable
        title="Incoming Leads"
        data={initialData}
        columns={columns}
        onDelete={(item) => toast.error("Delete functionality restricted")}
      />
    </div>
  );
}
