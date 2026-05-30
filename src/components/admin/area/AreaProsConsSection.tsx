"use client";

import type { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { ArrayInputField } from "../FormFields";

interface Props {
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
  control: Control<Record<string, unknown>>;
}

export function AreaProsConsSection({ register, errors, control }: Props) {
  return (
    <div className="card-base p-6 space-y-6">
      <h3 className="text-lg font-bold text-slate-800">Pros &amp; Cons</h3>
      <p className="text-sm text-slate-500">Add bullet points for what makes this area great and its drawbacks.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-600">
            <ThumbsUp size={16} />
            <span className="text-sm font-bold">Advantages</span>
          </div>
          <ArrayInputField
            label=""
            name="pros"
            register={register}
            errors={errors}
            control={control}
            placeholder="e.g. Future metro connectivity, High appreciation potential"
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-red-600">
            <ThumbsDown size={16} />
            <span className="text-sm font-bold">Drawbacks</span>
          </div>
          <ArrayInputField
            label=""
            name="cons"
            register={register}
            errors={errors}
            control={control}
            placeholder="e.g. Traffic during peak hours, Limited premium inventory"
          />
        </div>
      </div>
    </div>
  );
}
