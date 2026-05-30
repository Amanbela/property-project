"use client";

import { useState, useTransition } from "react";
import { createLead } from "@/actions/lead";
import { Purpose } from "@/types";

export function LeadForm() {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", budget: 5000000, preferredArea: "", purpose: "investment" as Purpose });

  return (
    <form
      className="glass-panel rounded-3xl p-6 md:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const res = await createLead(form);
          setMsg(res.message);
        });
      }}
    >
      <h2 className="heading-lg">Talk To Property Expert</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Get a personalized area shortlist from our advisors.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <input required className="focus-ring rounded-2xl border border-slate-200 bg-white/70 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950/70" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required className="focus-ring rounded-2xl border border-slate-200 bg-white/70 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950/70" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input type="number" className="focus-ring rounded-2xl border border-slate-200 bg-white/70 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950/70" placeholder="Budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} />
        <input className="focus-ring rounded-2xl border border-slate-200 bg-white/70 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950/70" placeholder="Preferred Area" value={form.preferredArea} onChange={(e) => setForm({ ...form, preferredArea: e.target.value })} />
        <label className="md:col-span-2 text-sm">
          Purpose
          <select
            className="focus-ring mt-1 w-full rounded-2xl border border-slate-200 bg-white/70 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950/70"
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value as Purpose })}
          >
            <option value="investment">Investment</option>
            <option value="family-living">Family living</option>
            <option value="rental-income">Rental income</option>
          </select>
        </label>
      </div>
      <button disabled={isPending} className="mt-5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:opacity-70">{isPending ? "Submitting..." : "Submit Lead"}</button>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </form>
  );
}
