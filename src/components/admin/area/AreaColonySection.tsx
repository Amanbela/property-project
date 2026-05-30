"use client";

import { useState, useEffect, useCallback } from "react";
import type { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { useController } from "react-hook-form";
import { MapPin, Plus } from "lucide-react";

interface ColonyOption {
  _id: string;
  colonyName: string;
  areaName?: string;
  averagePlotPrice?: number;
  futureGrowthScore?: number;
}

interface Props {
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
  control: Control<Record<string, unknown>>;
}

export function AreaColonySection({ errors, control }: Props) {
  const [colonies, setColonies] = useState<ColonyOption[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { field } = useController<any>({
    control,
    name: "suggestedColonies",
    defaultValue: [],
  });

  const selected: string[] = field.value ?? [];

  useEffect(() => {
    fetch("/api/colonies")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setColonies(data);
      })
      .catch(() => {});
  }, []);

  const toggleColony = useCallback(
    (id: string) => {
      const next = selected.includes(id)
        ? selected.filter((c) => c !== id)
        : [...selected, id];
      field.onChange(next);
    },
    [selected, field]
  );

  return (
    <div className="card-base p-6 space-y-6">
      <div className="flex items-center gap-2 text-brand-600">
        <MapPin size={20} />
        <h3 className="text-lg font-bold text-slate-800">Suggested Colonies</h3>
      </div>
      <p className="text-sm text-slate-500">
        Select 2-3 colonies to recommend in this area. Colonies are supporting recommendation data on the area detail page.
      </p>

      {colonies.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {colonies.map((col) => {
            const isSelected = selected.includes(col._id);
            return (
              <label
                key={col._id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                  isSelected
                    ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleColony(col._id)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{col.colonyName}</p>
                  {col.areaName && (
                    <p className="text-xs text-slate-400">{col.areaName}</p>
                  )}
                  <div className="mt-1.5 flex flex-wrap gap-2 text-[10px] text-slate-500">
                    {col.averagePlotPrice ? (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5">
                        ₹{col.averagePlotPrice.toLocaleString()}/sq.ft
                      </span>
                    ) : null}
                    {col.futureGrowthScore ? (
                      <span className="rounded-full bg-brand-50 text-brand-600 px-2 py-0.5">
                        Growth: {col.futureGrowthScore}/100
                      </span>
                    ) : null}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
          <Plus size={24} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm text-slate-400">
            No colonies available.{" "}
            <a href="/admin/colonies/create" className="text-brand-600 underline">
              Create colonies first
            </a>
          </p>
        </div>
      )}

      {errors.suggestedColonies && (
        <p className="text-xs text-red-500 font-medium">{errors.suggestedColonies?.message as string}</p>
      )}
    </div>
  );
}
