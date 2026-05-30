"use client";

import { useState, useTransition } from "react";
import { createLead } from "@/actions/lead";
import { Send, Loader2 } from "lucide-react";

interface AreaLeadFormProps {
  areaName: string;
}

export function AreaLeadForm({ areaName }: AreaLeadFormProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    budget: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const budgetNum = parseInt(form.budget, 10);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      setError("Please enter a valid budget amount.");
      return;
    }

    startTransition(async () => {
      const res = await createLead({
        name: form.name,
        phone: form.phone,
        budget: budgetNum,
        preferredArea: areaName,
        purpose: "investment",
      });

      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", phone: "", budget: "" });
      } else {
        setError(res.message);
      }
    });
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <Send size={20} className="text-emerald-600" />
        </div>
        <h3 className="font-display text-lg font-bold text-emerald-900">Request Received!</h3>
        <p className="mt-1 text-sm text-emerald-700">
          Our property experts will share curated options in {areaName} shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 md:p-8">
      <h3 className="font-display text-xl font-bold text-slate-900">Get Curated Property Options</h3>
      <p className="mt-1 text-sm text-slate-500">
        Tell us your budget and we&apos;ll find the best options in {areaName}.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Name</label>
          <input
            required
            className="input-base"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Phone Number</label>
          <input
            required
            type="tel"
            className="input-base"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Budget (₹)</label>
          <input
            required
            type="number"
            className="input-base"
            placeholder="3000000"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full justify-center py-3.5 text-base"
        >
          {isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          {isPending ? "Submitting..." : "Get Curated Property Options"}
        </button>

        <p className="text-center text-xs text-slate-400">
          We respect your privacy. No spam calls, only relevant options.
        </p>
      </form>
    </div>
  );
}
