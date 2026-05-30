"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Train, Plane, TrainTrack } from "lucide-react";
import { InputField, CheckboxField } from "../FormFields";

interface Props {
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
}

export function AreaConnectivitySection({ register, errors }: Props) {
  return (
    <div className="card-base p-6 space-y-6">
      <div className="flex items-center gap-2 text-brand-600">
        <Train size={20} />
        <h3 className="text-lg font-bold text-slate-800">Connectivity &amp; Transit</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Train size={14} className="text-slate-400" /> Metro Distance (km)
          </label>
          <input
            type="number"
            step="0.1"
            {...register("connectivity.metroDistanceKm", { valueAsNumber: true })}
            placeholder="e.g. 2.5"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Plane size={14} className="text-slate-400" /> Airport Distance (km)
          </label>
          <input
            type="number"
            step="0.1"
            {...register("connectivity.airportDistanceKm", { valueAsNumber: true })}
            placeholder="e.g. 12"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <TrainTrack size={14} className="text-slate-400" /> Railway Distance (km)
          </label>
          <input
            type="number"
            step="0.1"
            {...register("connectivity.railwayDistanceKm", { valueAsNumber: true })}
            placeholder="e.g. 8"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      </div>
      <CheckboxField label="Nearby Metro Station (walking distance)" name="nearbyMetro" register={register} errors={errors} />
    </div>
  );
}
