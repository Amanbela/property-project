"use client";

import type { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { IndianRupee, Tags } from "lucide-react";
import { InputField } from "../FormFields";

interface Props {
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
  control: Control<Record<string, unknown>>;
}

const budgetOptions = [
  { value: "budget", label: "Budget", desc: "Under ₹3,000/sq.ft" },
  { value: "mid-range", label: "Mid-Range", desc: "₹3,000–₹5,000/sq.ft" },
  { value: "premium", label: "Premium", desc: "₹5,000–₹8,000/sq.ft" },
  { value: "luxury", label: "Luxury", desc: "₹8,000+/sq.ft" },
] as const;

export function AreaPricingSection({ register, errors }: Props) {
  return (
    <div className="card-base p-6 space-y-6">
      <div className="flex items-center gap-2 text-brand-600">
        <IndianRupee size={20} />
        <h3 className="text-lg font-bold text-slate-800">Pricing &amp; Budget Category</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Average Price (₹/sq.ft)" name="averagePrice" type="number" register={register} errors={errors} placeholder="e.g. 5800" />
        <InputField label="Average Price Per Sq.ft (alt)" name="averagePricePerSqft" type="number" register={register} errors={errors} placeholder="e.g. 5800" />
      </div>
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700">Budget Category</label>
        <p className="text-xs text-slate-400">Select one or more categories</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {budgetOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-brand-300 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:checked]:ring-1 has-[:checked]:ring-brand-500/20"
            >
              <input
                type="checkbox"
                value={opt.value}
                {...register("budgetCategory")}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <div>
                <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                <p className="text-[10px] text-slate-400">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
