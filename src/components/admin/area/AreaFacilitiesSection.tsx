"use client";

import type { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { School, Hospital, ShoppingBag, Building2 } from "lucide-react";
import { ArrayInputField } from "../FormFields";

interface Props {
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
  control: Control<Record<string, unknown>>;
}

const sections = [
  { icon: School, label: "Nearby Schools", name: "nearbySchools", color: "text-sky-600" },
  { icon: Hospital, label: "Nearby Hospitals", name: "nearbyHospitals", color: "text-red-600" },
  { icon: ShoppingBag, label: "Nearby Malls & Shopping", name: "nearbyMalls", color: "text-purple-600" },
  { icon: Building2, label: "Nearby IT Hubs & Business", name: "nearbyITHubs", color: "text-brand-600" },
] as const;

export function AreaFacilitiesSection({ register, errors, control }: Props) {
  return (
    <div className="card-base p-6 space-y-6">
      <div className="flex items-center gap-2 text-brand-600">
        <Building2 size={20} />
        <h3 className="text-lg font-bold text-slate-800">Nearby Facilities</h3>
      </div>
      <p className="text-sm text-slate-500">Add nearby facilities as comma-separated values. These are displayed on the area detail page.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div key={sec.name} className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon size={16} className={sec.color} />
                <label className="text-sm font-semibold text-slate-700">{sec.label}</label>
              </div>
              <ArrayInputField
                label=""
                name={sec.name}
                register={register}
                errors={errors}
                control={control}
                placeholder="Enter names separated by commas"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
