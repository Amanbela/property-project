"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { TrendingUp, Brain } from "lucide-react";

interface Props {
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
}

function RangeInput({
  label,
  name,
  register,
  errors,
}: {
  label: string;
  name: string;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className="text-xs font-mono font-bold text-brand-600" id={`${name}-value`} />
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          {...register(name, { valueAsNumber: true })}
          className="flex-1 h-2 rounded-full appearance-none cursor-pointer
            bg-slate-200 accent-brand-600
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-brand-600
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-pointer"
          onChange={(e) => {
            const val = Number(e.target.value);
            const display = document.getElementById(`${name}-value`);
            if (display) display.textContent = String(val);
            e.target.style.background = `linear-gradient(to right, #2563eb ${val}%, #e2e8f0 ${val}%)`;
          }}
        />
        <output
          htmlFor={name}
          className="min-w-[3rem] text-center text-sm font-bold text-brand-700 bg-brand-50 rounded-lg px-2 py-1"
        >
          {0}
        </output>
      </div>
      {errors[name] && <p className="text-xs text-red-500 font-medium">{errors[name]?.message as string}</p>}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              var el = document.querySelector('[name="${name}"]');
              if (el) {
                var val = parseInt(el.value) || 0;
                var display = document.getElementById('${name}-value');
                var output = el.nextElementSibling;
                if (display) display.textContent = val;
                if (output) output.textContent = val;
                el.style.background = 'linear-gradient(to right, #2563eb ' + val + '%, #e2e8f0 ' + val + '%)';
                el.addEventListener('input', function() {
                  var v = parseInt(this.value) || 0;
                  var d = document.getElementById('${name}-value');
                  var o = this.nextElementSibling;
                  if (d) d.textContent = v;
                  if (o) o.textContent = v;
                  this.style.background = 'linear-gradient(to right, #2563eb ' + v + '%, #e2e8f0 ' + v + '%)';
                });
              }
            });
          `,
        }}
      />
    </div>
  );
}

const scores = [
  { label: "Investment Score", name: "investmentScore", desc: "Long-term ROI potential" },
  { label: "Family Score", name: "familyScore", desc: "Community & education quality" },
  { label: "Rental Demand", name: "rentalDemand", desc: "Tenant demand & yield stability" },
  { label: "Future Growth", name: "futureGrowth", desc: "Infrastructure & development pipeline" },
  { label: "Traffic Score", name: "trafficScore", desc: "Road quality & commute ease" },
] as const;

export function AreaIntelligenceSection({ register, errors }: Props) {
  return (
    <div className="card-base p-6 space-y-6">
      <div className="flex items-center gap-2 text-brand-600">
        <Brain size={20} />
        <h3 className="text-lg font-bold text-slate-800">Area Intelligence &amp; Recommendation Scores</h3>
      </div>
      <p className="text-sm text-slate-500">Set scores from 0–100. These drive the AI-powered area analysis on the frontend.</p>
      <div className="grid gap-6 md:grid-cols-2">
        {scores.map((s) => (
          <div key={s.name} className="space-y-1">
            <RangeInput label={s.label} name={s.name} register={register} errors={errors} />
            <p className="text-xs text-slate-400">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
