"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Area } from "@/types";
import { getRecommendations } from "@/lib/recommendation";
import { Lifestyle, Purpose } from "@/types";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
      <div className="container-main flex h-16 items-center justify-between">
        <Link href="/" className="text-sm font-semibold tracking-tight md:text-base">
          Indore Property Budget Finder
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link className="transition-colors hover:text-blue-600" href="/areas">Areas</Link>
          <Link className="transition-colors hover:text-blue-600" href="/blog">Blog</Link>
          <Link className="rounded-full bg-slate-900 px-4 py-1.5 text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-slate-900" href="/admin/dashboard">Admin</Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/70 py-10 dark:border-slate-800/80">
      <div className="container-main flex flex-col items-center justify-between gap-3 text-sm text-slate-600 md:flex-row dark:text-slate-300">
        <p>Built for smart property decisions in Indore.</p>
        <p>Data-led guidance for families and investors.</p>
      </div>
    </footer>
  );
}

export function AreaCard({ area }: { area: Area }) {
  return (
    <Link href={`/areas/${area.slug}`} className="block cursor-pointer">
      <motion.article
        whileHover={{ y: -5, scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className="glass-panel rounded-3xl p-5 md:p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight">{area.name}</h3>
          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
            Score {area.investmentScore}/100
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{area.description}</p>
        <div className="mt-4 space-y-1 text-sm">
          <p>Avg price: ₹{area.averagePrice.toLocaleString()}/sq.ft</p>
          <p className="text-slate-600 dark:text-slate-300">Investment: {area.investmentScore}/100 · Rental: {area.rentalDemand}/100</p>
        </div>
        <Link href={`/areas/${area.slug}`} className="mt-5 inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-medium transition-all hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:hover:border-blue-400">
        View Area Intelligence
        </Link>
      </motion.article>
    </Link>
  );
}

export function BlogCard({ title, excerpt, slug }: { title: string; excerpt: string; slug: string }) {
  return (
    <motion.article whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="glass-panel rounded-3xl p-6">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{excerpt}</p>
      <Link className="mt-5 inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-slate-700" href={`/blog/${slug}`}>
        Read article
      </Link>
    </motion.article>
  );
}

export function RecommendationForm({
  areas,
  weightsJson
}: {
  areas: Area[];
  weightsJson?: string | null;
}) {
  const [budget, setBudget] = useState(8000000);
  const [purpose, setPurpose] = useState<Purpose>("investment");
  const [lifestyle, setLifestyle] = useState<Lifestyle>("high-growth");
  const recs = useMemo(
    () => getRecommendations(areas, { budget, purpose, lifestyle }, { weightsOverrideJson: weightsJson }),
    [areas, budget, purpose, lifestyle, weightsJson]
  );

  if (!areas.length) {
    return (
      <section className="glass-panel rounded-3xl p-6 md:p-8">
        <h2 className="heading-lg">Budget Recommendation Tool</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Publish areas in the admin CMS to enable live recommendations.</p>
      </section>
    );
  }

  return (
    <section className="glass-panel rounded-3xl p-6 md:p-8">
      <h2 className="heading-lg">Budget Recommendation Tool</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Get intelligent area picks tailored to your goals and lifestyle.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <input type="number" className="focus-ring rounded-2xl border border-slate-200 bg-white/70 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950/70" value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
        <select className="focus-ring rounded-2xl border border-slate-200 bg-white/70 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950/70" value={purpose} onChange={(e) => setPurpose(e.target.value as Purpose)}><option value="investment">Investment</option><option value="family-living">Family Living</option><option value="rental-income">Rental Income</option></select>
        <select className="focus-ring rounded-2xl border border-slate-200 bg-white/70 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950/70" value={lifestyle} onChange={(e) => setLifestyle(e.target.value as Lifestyle)}><option value="luxury">Luxury</option><option value="affordable">Affordable</option><option value="family-friendly">Family-Friendly</option><option value="high-growth">High-Growth</option><option value="premium">Premium</option></select>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {recs.topAreas.map((r) => (
          <motion.div key={r.slug} whileHover={{ y: -2 }} className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-950/70">
            <p className="font-medium">{r.name} <span className="text-blue-600">({r.recommendationScore})</span></p>
            <p className="mt-1 text-xs text-slate-500">Confidence: {recs.recommendationConfidence}%</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{r.explanationSummary}</p>
            <p className="mt-2 text-xs text-slate-500">{r.investmentInsight}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-blue-200/60 bg-blue-50/60 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Recommendation confidence: {recs.recommendationConfidence}%</p>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{recs.explanationSummary}</p>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{recs.investmentInsight}</p>
      </div>
    </section>
  );
}

export const HeroSection = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-7 text-white shadow-2xl md:p-12">
    <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl" />
    <p className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-wider">Property Intelligence Platform</p>
    <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">{title}</h1>
    <p className="mt-4 max-w-2xl text-sm text-blue-100 md:text-base">{subtitle}</p>
  </section>
);
export const SearchFilters = () => <div className="rounded-xl border p-3 text-sm">Search and filter controls can be expanded here.</div>;
export const FAQAccordion = ({ items }: { items: { q: string; a: string }[] }) => <div className="space-y-2">{items.map((i) => <details key={i.q} className="rounded-xl border p-3"><summary>{i.q}</summary><p className="mt-2 text-sm">{i.a}</p></details>)}</div>;
export const CTASection = () => <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 p-7 text-white md:p-10"><div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/20 blur-2xl" /><h3 className="text-2xl font-semibold tracking-tight">Ready to invest smarter in Indore?</h3><p className="mt-2 max-w-2xl text-sm text-blue-100">Explore curated areas based on budget, rental demand, and growth potential.</p><Link href="/areas" className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-medium text-blue-700 transition-transform hover:-translate-y-0.5">Explore areas</Link></section>;
export const ThemeToggle = () => <button className="rounded-lg border px-2 py-1 text-xs">Theme</button>;
export const MobileSidebar = () => <aside className="rounded-xl border p-3 md:hidden">Mobile menu</aside>;
export const AreaScoreCard = ({ label, value }: { label: string; value: number }) => <div className="rounded-xl border p-3">{label}: {value}/10</div>;
export const LoadingSkeleton = () => <div className="h-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />;
export const EmptyState = ({ text }: { text: string }) => <div className="rounded-xl border border-dashed p-5 text-center text-sm">{text}</div>;
