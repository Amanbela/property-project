"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Building2 } from "lucide-react";

interface Props {
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
}

const propertyOptions = [
  { value: "plot", label: "Plots", icon: "⊞", desc: "Independent land parcels" },
  { value: "flat", label: "Flats/Apartments", icon: "🏢", desc: "Multi-story residential" },
  { value: "villa", label: "Villas", icon: "🏡", desc: "Independent houses" },
  { value: "commercial", label: "Commercial", icon: "🏬", desc: "Shops & offices" },
] as const;

export function AreaPropertySection({ register }: Props) {
  return (
    <div className="card-base p-6 space-y-6">
      <div className="flex items-center gap-2 text-brand-600">
        <Building2 size={20} />
        <h3 className="text-lg font-bold text-slate-800">Property Types Supported</h3>
      </div>
      <p className="text-sm text-slate-500">Which property types are available in this area?</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {propertyOptions.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-5 text-center transition-all hover:border-brand-300 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:checked]:ring-1 has-[:checked]:ring-brand-500/20"
          >
            <input
              type="checkbox"
              value={opt.value}
              {...register("propertyTypes")}
              className="sr-only"
            />
            <span className="text-2xl">{opt.icon}</span>
            <span className="text-sm font-medium text-slate-700">{opt.label}</span>
            <span className="text-[10px] text-slate-400">{opt.desc}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
