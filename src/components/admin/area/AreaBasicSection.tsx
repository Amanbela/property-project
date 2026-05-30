"use client";

import type { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { MapPin } from "lucide-react";
import { InputField, TextAreaField, ImageField } from "../FormFields";

interface Props {
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
  control: Control<Record<string, unknown>>;
}

export function AreaBasicSection({ register, errors, control }: Props) {
  return (
    <div className="card-base p-6 space-y-6">
      <div className="flex items-center gap-2 text-brand-600">
        <MapPin size={20} />
        <h3 className="text-lg font-bold text-slate-800">Basic Information</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Area Name" name="name" register={register} errors={errors} required placeholder="e.g. Super Corridor" />
        <InputField label="Slug" name="slug" register={register} errors={errors} placeholder="auto-generated from name" />
      </div>
      <TextAreaField label="Short Description" name="description" register={register} errors={errors} rows={3} placeholder="Describe the area, its vibe, and key highlights..." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImageField label="Featured Image" name="featuredImage" register={register} errors={errors} control={control} />
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-700">Coordinates</p>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Latitude" name="coordinates.lat" type="number" register={register} errors={errors} placeholder="22.7196" />
            <InputField label="Longitude" name="coordinates.lng" type="number" register={register} errors={errors} placeholder="75.8577" />
          </div>
          <p className="text-xs text-slate-400">Default: Indore city center</p>
        </div>
      </div>
    </div>
  );
}
