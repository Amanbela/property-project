"use client";

import { useState, useEffect } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Search } from "lucide-react";

interface Props {
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
}

export function AreaSeoSection({ register, errors }: Props) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <div className="card-base p-6 space-y-6">
      <div className="flex items-center gap-2 text-brand-600">
        <Search size={20} />
        <h3 className="text-lg font-bold text-slate-800">SEO &amp; Search Optimization</h3>
      </div>
      <p className="text-sm text-slate-500">
        Optimize how this area page appears in search results. Helps rank for keywords like &quot;best area in Indore&quot;.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">SEO Title</label>
            <span className={`text-xs font-mono ${title.length > 60 ? "text-red-500" : title.length > 50 ? "text-amber-500" : "text-slate-400"}`}>
              {title.length}/60
            </span>
          </div>
          <input
            type="text"
            {...register("seoTitle")}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`${"Area Name"} Property Intelligence & Investment Guide 2026`}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
          {errors.seoTitle && <p className="text-xs text-red-500 font-medium">{errors.seoTitle?.message as string}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">Meta Description</label>
            <span className={`text-xs font-mono ${desc.length > 160 ? "text-red-500" : desc.length > 140 ? "text-amber-500" : "text-slate-400"}`}>
              {desc.length}/160
            </span>
          </div>
          <textarea
            rows={2}
            {...register("seoDescription")}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Smart area intelligence report for Super Corridor, Indore. View investment score, family score, rental demand, and expert recommendations."
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
          />
          {errors.seoDescription && <p className="text-xs text-red-500 font-medium">{errors.seoDescription?.message as string}</p>}
        </div>
      </div>

      {/* SEO Preview */}
      {title || desc ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Search Result Preview</p>
          <p className="text-sm text-blue-700 font-medium truncate">{title || "Area Name — Property Intelligence"}</p>
          <p className="text-xs text-green-800 truncate">https://indorepropertybudgetfinder.com/areas/area-slug</p>
          <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{desc || "Smart area intelligence report..."}</p>
        </div>
      ) : null}
    </div>
  );
}
