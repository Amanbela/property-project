"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Eye, Star } from "lucide-react";
import { CheckboxField } from "../FormFields";

interface Props {
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
}

export function AreaStatusSection({ register, errors }: Props) {
  return (
    <div className="card-base p-6 space-y-4">
      <h3 className="text-lg font-bold text-slate-800">Status &amp; Visibility</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 has-[:checked]:border-emerald-400 has-[:checked]:bg-emerald-50">
          <input type="checkbox" {...register("published")} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-emerald-600" />
            <div>
              <p className="text-sm font-medium text-slate-700">Published</p>
              <p className="text-[10px] text-slate-400">Visible on the public site</p>
            </div>
          </div>
        </label>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 has-[:checked]:border-amber-400 has-[:checked]:bg-amber-50">
          <input type="checkbox" {...register("featured")} className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
          <div className="flex items-center gap-2">
            <Star size={16} className="text-amber-600" />
            <div>
              <p className="text-sm font-medium text-slate-700">Featured</p>
              <p className="text-[10px] text-slate-400">Highlighted on homepage</p>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}
