"use client";

import { useTransition } from "react";
import { exportLeadsCsv } from "@/actions/admin-leads";

export function ExportLeadsButton() {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="rounded-full border border-slate-300 px-4 py-2 text-sm dark:border-slate-600"
      onClick={() => {
        start(async () => {
          const res = await exportLeadsCsv();
          if (!res.ok) return;
          const blob = new Blob([res.csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "leads.csv";
          a.click();
          URL.revokeObjectURL(url);
        });
      }}
    >
      {pending ? "Exporting…" : "Export CSV"}
    </button>
  );
}
