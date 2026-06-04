"use client";

import React, { useState, useEffect, useTransition } from "react";
import { autoGenerateComparisons } from "@/actions/admin-comparisons";
import { Sparkles, Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface AreaOption {
  _id: string;
  name: string;
  slug: string;
}

interface AutoGenerateModalProps {
  onDone: () => void;
}

export function AutoGenerateModal({ onDone }: AutoGenerateModalProps) {
  const [areas, setAreas] = useState<AreaOption[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [pending, start] = useTransition();
  const [result, setResult] = useState<{ created: number; skipped: number; errors: string[] } | null>(null);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch("/api/areas");
        const data = await res.json();
        setAreas(Array.isArray(data) ? data : []);
      } catch {
        setAreas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, []);

  const toggleArea = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(areas.map((a) => a._id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const count = selectedIds.size;
  const combinations = count * (count - 1) / 2;

  const handleGenerate = () => {
    if (count < 2) return;
    start(async () => {
      const res = await autoGenerateComparisons(Array.from(selectedIds));
      if (res.ok) {
        setResult({ created: res.created, skipped: res.skipped, errors: res.errors });
      } else {
        setResult({ created: 0, skipped: 0, errors: [res.error] });
      }
    });
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-purple-500" />
          <h3 className="text-lg font-bold text-slate-800">Auto-Generate Comparisons</h3>
        </div>
        <p className="text-sm text-slate-500 animate-pulse">Loading areas...</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-purple-500" />
          <h3 className="text-lg font-bold text-slate-800">Generation Complete</h3>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
            <CheckCircle size={16} /> {result.created} created
          </span>
          <span className="flex items-center gap-1.5 text-amber-600 font-semibold">
            <XCircle size={16} /> {result.skipped} skipped
          </span>
        </div>
        {result.errors.length > 0 && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3">
            <p className="text-xs font-semibold text-red-700 mb-1">Errors:</p>
            {result.errors.map((err, i) => (
              <p key={i} className="text-xs text-red-600">{err}</p>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={onDone}
          className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-purple-500" />
          <h3 className="text-lg font-bold text-slate-800">Auto-Generate Comparisons</h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button type="button" onClick={selectAll} className="text-brand-600 hover:underline">Select all</button>
          <span className="text-slate-300">|</span>
          <button type="button" onClick={deselectAll} className="text-brand-600 hover:underline">Deselect all</button>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Select areas to generate all possible unique comparisons between them.
      </p>

      {count >= 2 && (
        <div className="rounded-xl bg-brand-50 border border-brand-200 px-4 py-3">
          <p className="text-sm font-semibold text-brand-800">
            {count} areas selected → will generate up to <span className="text-lg">{combinations}</span> comparison{combinations !== 1 ? "s" : ""}
          </p>
          <p className="text-xs text-brand-600">Existing comparisons will be skipped automatically.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-white">
        {areas.map((area) => {
          const isSelected = selectedIds.has(area._id);
          return (
            <button
              key={area._id}
              type="button"
              onClick={() => toggleArea(area._id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-left transition-all ${
                isSelected
                  ? "bg-brand-100 text-brand-800 ring-1 ring-brand-300"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 ring-1 ring-slate-200"
              }`}
            >
              <span className={`w-3 h-3 rounded border flex items-center justify-center shrink-0 ${
                isSelected ? "bg-brand-600 border-brand-600" : "border-slate-300"
              }`}>
                {isSelected && <span className="text-white text-[8px]">✓</span>}
              </span>
              {area.name}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          disabled={pending || count < 2}
          onClick={handleGenerate}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition-all hover:bg-purple-700 disabled:opacity-50"
        >
          {pending ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {pending ? "Generating..." : count < 2 ? "Select at least 2 areas" : `Generate ${combinations} Comparison${combinations !== 1 ? "s" : ""}`}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
