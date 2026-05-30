"use client";

import type { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { Heart } from "lucide-react";
import { ArrayInputField } from "../FormFields";

interface Props {
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
  control: Control<Record<string, unknown>>;
}

export function AreaLifestyleSection({ register, errors, control }: Props) {
  return (
    <div className="card-base p-6 space-y-6">
      <div className="flex items-center gap-2 text-brand-600">
        <Heart size={20} />
        <h3 className="text-lg font-bold text-slate-800">Lifestyle &amp; Recommendation Tags</h3>
      </div>
      <p className="text-sm text-slate-500">
        Tags help the AI match areas to user preferences. Add comma-separated values.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ArrayInputField
          label="Lifestyle Tags"
          name="lifestyleTags"
          register={register}
          errors={errors}
          control={control}
          placeholder="e.g. high-growth, family-friendly, luxury, affordable"
        />
        <ArrayInputField
          label="Recommendation Tags"
          name="tags"
          register={register}
          errors={errors}
          control={control}
          placeholder="e.g. connectivity, green, student, it-hub"
        />
      </div>
      <div className="rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Suggested Tags</p>
        <div className="flex flex-wrap gap-2">
          {["high-growth", "family-friendly", "luxury", "affordable", "premium", "student", "commercial", "green", "connectivity", "it-hub", "peaceful", "rental"].map((tag) => (
            <span
              key={tag}
              className="cursor-pointer rounded-full bg-white border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50"
              onClick={() => {
                const input = document.querySelector('[name="tags"]') as HTMLInputElement;
                if (input) {
                  const current = input.value ? input.value.split(",").map((s) => s.trim()).filter(Boolean) : [];
                  if (!current.includes(tag)) {
                    current.push(tag);
                    input.value = current.join(", ");
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                  }
                }
              }}
            >
              + {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
