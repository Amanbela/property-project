"use client";

import { useState, type ReactNode } from "react";
import { FileText, Code } from "lucide-react";

interface CreatePageTabsProps {
  formEntry: ReactNode;
  jsonImport: ReactNode;
}

export function CreatePageTabs({ formEntry, jsonImport }: CreatePageTabsProps) {
  const [activeTab, setActiveTab] = useState<"form" | "json">("form");

  return (
    <div className="pb-20">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("form")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "form"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileText size={16} />
          Form Entry
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("json")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "json"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Code size={16} />
          JSON Import
        </button>
      </div>

      {/* Active Tab Content */}
      <div>
        {activeTab === "form" ? formEntry : jsonImport}
      </div>
    </div>
  );
}
