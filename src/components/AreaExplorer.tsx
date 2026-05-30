"use client";

import { useMemo, useState } from "react";
import type { Area } from "@/types";
import { AreaCard, EmptyState } from "@/components/ui";

export function AreaExplorer({ areas }: { areas: Area[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"investmentScore" | "familyScore" | "rentalDemand">("investmentScore");
  const [minScore, setMinScore] = useState(0);

  const filtered = useMemo(
    () =>
      areas
        .filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
        .filter((a) => a.investmentScore >= minScore && a.familyScore >= minScore && a.rentalDemand >= minScore)
        .sort((a, b) => (b[sort] ?? 0) - (a[sort] ?? 0)),
    [areas, query, minScore, sort]
  );

  return (
    <>
      <div className="glass-panel mt-6 grid gap-3 rounded-3xl p-4 md:grid-cols-3 md:p-5">
        <input
          className="focus-ring rounded-2xl border border-slate-200 bg-white/70 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950/70"
          placeholder="Search area"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="focus-ring rounded-2xl border border-slate-200 bg-white/70 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950/70"
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
        >
          <option value="investmentScore">Sort by investment score</option>
          <option value="familyScore">Sort by family score</option>
          <option value="rentalDemand">Sort by rental demand</option>
        </select>
        <input
          className="focus-ring rounded-2xl border border-slate-200 bg-white/70 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950/70"
          type="number"
          min={0}
          max={10}
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
        />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length ? filtered.map((a) => <AreaCard key={a.slug} area={a} />) : <EmptyState text="No areas match current filters." />}
      </div>
    </>
  );
}
