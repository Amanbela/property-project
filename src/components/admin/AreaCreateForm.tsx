"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createArea } from "@/actions/admin-areas";

type FormState = { ok?: boolean; error?: string | Record<string, string[]> };

const initial: FormState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-slate-900"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

export function AreaCreateForm() {
  const [state, formAction] = useFormState(createArea, initial);

  return (
    <form action={formAction} className="glass-panel space-y-4 rounded-3xl p-6">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm">
          Name *
          <input name="name" required className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          Slug (optional)
          <input name="slug" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" placeholder="auto from name" />
        </label>
        <label className="col-span-full text-sm">
          Description
          <textarea name="description" rows={3} className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          Avg price / sq.ft
          <input name="averagePrice" type="number" required className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          Investment (0–10)
          <input name="investmentScore" type="number" min={0} max={10} required className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          Family (0–10)
          <input name="familyScore" type="number" min={0} max={10} required className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          Rental demand (0–10)
          <input name="rentalDemand" type="number" min={0} max={10} required className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          Future growth (0–10)
          <input name="futureGrowth" type="number" min={0} max={10} required className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          Traffic (0–10)
          <input name="trafficCondition" type="number" min={0} max={10} required className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          Lat
          <input name="lat" type="number" step="any" required className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          Lng
          <input name="lng" type="number" step="any" required className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="nearbyMetro" /> Nearby metro
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked /> Published
        </label>
        <label className="col-span-full text-sm">
          Schools (comma-separated)
          <input name="nearbySchoolsCsv" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="col-span-full text-sm">
          Hospitals (comma-separated)
          <input name="nearbyHospitalsCsv" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="col-span-full text-sm">
          Lifestyle tags (comma-separated)
          <input name="lifestyleTagsCsv" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" placeholder="e.g. high-growth, family-friendly" />
        </label>
        <label className="col-span-full text-sm">
          Pros (comma-separated)
          <input name="prosCsv" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="col-span-full text-sm">
          Cons (comma-separated)
          <input name="consCsv" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          Featured image URL
          <input name="featuredImage" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="col-span-full text-sm">
          Gallery URLs (comma-separated)
          <input name="galleryCsv" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          SEO title
          <input name="seoTitle" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
        <label className="text-sm">
          SEO description
          <input name="seoDescription" className="focus-ring mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-950" />
        </label>
      </div>
      <SubmitButton label="Create area" />
      {state?.ok === true && <p className="text-sm text-green-600">Saved successfully.</p>}
      {state?.error && <p className="text-sm text-red-600">{typeof state.error === "string" ? state.error : JSON.stringify(state.error)}</p>}
    </form>
  );
}
