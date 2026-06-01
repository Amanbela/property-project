"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Home,
  MapPin,
  Sparkles,
  Search,
  Activity,
  Award
} from "lucide-react";
import { useEffect, useState } from "react";
import { useWizardStore } from "../store/wizard-store";
import { trackRecommendationSubmit } from "@/lib/analytics";
import { AreaRecommendationCard } from "./AreaRecommendationCard";
import type { Variants } from "framer-motion";

const slide: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.25 } },
};

const BUDGETS = [
  { label: "Under 30L", desc: "Affordable entry", min: 0, max: 3000000 },
  { label: "30L – 50L", desc: "Smart starter choice", min: 3000000, max: 5000000 },
  { label: "50L – 80L", desc: "Mid-range sweet spot", min: 5000000, max: 8000000 },
  { label: "80L – 1.2Cr", desc: "Premium residential", min: 8000000, max: 12000000 },
  { label: "1.2Cr – 2Cr", desc: "Luxury & high-growth", min: 12000000, max: 20000000 },
  { label: "2Cr+", desc: "Ultra-premium investment", min: 20000000, max: 999999999 },
];

const PROPERTY_TYPES = [
  { type: "plot" as const, label: "Plot / Land", icon: MapPin, desc: "Land ownership, maximum flexibility" },
  { type: "flat" as const, label: "Apartment / Flat", icon: Building2, desc: "Modern living, immediate possession" },
  { type: "villa" as const, label: "Villa / Independent House", icon: Home, desc: "Privacy with premium luxury amenities" },
];

const PURPOSES = [
  { value: "investment" as const, title: "Pure Investment", desc: "Maximize capital appreciation and future ROI" },
  { value: "family-living" as const, title: "End Use — Family Living", desc: "Best schools, safety, parks, and community living" },
  { value: "rental-income" as const, title: "Rental Income", desc: "Focus on stable monthly yields and high rental demand" },
];

const LIFESTYLES = [
  { value: "high-growth" as const, label: "High Growth Corridor", desc: "Focus on fast-appreciating masterplan zones" },
  { value: "affordable" as const, label: "Affordable / Pocket Friendly", desc: "Entry-level opportunities with high utility" },
  { value: "family-friendly" as const, label: "Family / Peaceful", desc: "Socio-residential core with daily amenities" },
  { value: "premium" as const, label: "Premium / Executive", desc: "Elite neighborhoods and high developer trust" },
  { value: "luxury" as const, label: "Ultra Luxury", desc: "Top-tier premium addresses and custom infrastructure" },
];

const POPULAR_LOCATIONS = [
  "Vijay Nagar",
  "Super Corridor",
  "Bypass Road",
  "Rau",
  "Palasia",
  "Bengali Square",
];

const ANALYSIS_STEPS = [
  "Analyzing your budget parameters...",
  "Matching your lifestyle preferences...",
  "Scanning real-time MongoDB area files...",
  "Ranking best high-growth opportunities...",
  "Verifying colony RERA compliance...",
  "Finalizing your personalized matches ✓",
];

interface ColonyItem {
  colonyName: string;
  slug: string;
  averagePlotPrice: number;
  averageFlatPrice: number;
  reraStatus: boolean;
}

interface AreaRecommendation {
  id: string;
  name: string;
  slug: string;
  description: string;
  featuredImage: string;
  averagePrice: number;
  investmentScore: number;
  familyScore: number;
  futureGrowth: number;
  matchScore: number;
  suggestedColonies: ColonyItem[];
  whyRecommended: string[];
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  const stepNames = ["Budget", "Property Type", "Purpose", "Lifestyle & Location", "AI Analysis", "Matches"];
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-muted">Step {current} of {total}</span>
        <span className="text-xs font-semibold text-brand-600">
          {stepNames[current - 1] || "Processing"}
        </span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
              i < current ? "bg-brand-600" : "bg-slate-100"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse border border-slate-100 rounded-3xl p-5 md:p-6 bg-white flex flex-col md:flex-row gap-6 mb-4">
      <div className="h-44 w-full md:w-56 bg-slate-100 rounded-2xl flex-shrink-0" />
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
        </div>
        <div className="h-8 bg-slate-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export function RecommendationWizard() {
  const {
    step,
    nextStep,
    prevStep,
    propertyType,
    setPropertyType,
    purpose,
    setPurpose,
    budgetMin,
    budgetMax,
    budgetLabel,
    setBudget,
    lifestyle,
    setLifestyle,
    preferredLocation,
    setPreferredLocation,
    reset,
  } = useWizardStore();

  const [analysisStep, setAnalysisStep] = useState(0);
  const [results, setResults] = useState<AreaRecommendation[]>([]);
  const [sessionStats, setSessionStats] = useState({
    requests: 0,
    views: 0,
    clicks: 0,
  });

  // Load session tracking from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const requests = Number(localStorage.getItem("indore_prop_requests") || 0);
      const views = Number(localStorage.getItem("indore_prop_views") || 0);
      const clicks = Number(localStorage.getItem("indore_prop_clicks") || 0);
      setSessionStats({ requests, views, clicks });
    }
  }, []);

  // Update session tracking helper
  const updateSessionMetric = (key: "indore_prop_requests" | "indore_prop_views" | "indore_prop_clicks") => {
    if (typeof window !== "undefined") {
      const val = Number(localStorage.getItem(key) || 0) + 1;
      localStorage.setItem(key, String(val));
      
      const requests = Number(localStorage.getItem("indore_prop_requests") || 0);
      const views = Number(localStorage.getItem("indore_prop_views") || 0);
      const clicks = Number(localStorage.getItem("indore_prop_clicks") || 0);
      setSessionStats({ requests, views, clicks });
    }
  };

  // Run analysis animation on step 5
  useEffect(() => {
    if (step !== 5) return;
    setAnalysisStep(0);

    // Dynamic API fetch
    const fetchRecommendations = async () => {
      try {
        const response = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            budgetMin,
            budgetMax,
            purpose,
            propertyType,
            lifestyle,
            preferredLocation,
          }),
        });
        const data = await response.json();
        setResults(data);

        trackRecommendationSubmit(budgetLabel, propertyType);

        // Track request and views in localStorage
        updateSessionMetric("indore_prop_requests");
        if (data.length > 0) {
          if (typeof window !== "undefined") {
            const currentViews = Number(localStorage.getItem("indore_prop_views") || 0);
            localStorage.setItem("indore_prop_views", String(currentViews + data.length));
          }
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      }
    };

    fetchRecommendations();

    const interval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev >= ANALYSIS_STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => nextStep(), 500);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Handle WhatsApp Click Track
  const handleWhatsAppClick = (areaName: string) => {
    updateSessionMetric("indore_prop_clicks");
    
    // Persist click event detail
    if (typeof window !== "undefined") {
      const clickLogs = JSON.parse(localStorage.getItem("indore_wa_click_logs") || "[]");
      clickLogs.push({ area: areaName, timestamp: new Date().toISOString() });
      localStorage.setItem("indore_wa_click_logs", JSON.stringify(clickLogs));
    }
  };

  return (
    <div
      id="wizard"
      className="mx-auto w-full max-w-3xl rounded-4xl border border-slate-100 bg-white p-6 shadow-card md:p-10 transition-all duration-300"
    >
      {/* Sparkles Brand Header */}
      <div className="flex items-center gap-2 mb-6 bg-brand-50 border border-brand-100 rounded-2xl py-2 px-3.5 w-fit">
        <Sparkles size={14} className="text-brand-600 animate-pulse" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
          AI-Powered Real Estate recommender
        </span>
      </div>

      <StepIndicator current={step} total={6} />

      <div className="min-h-[380px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          
          {/* Step 1 — Budget */}
          {step === 1 && (
            <motion.div key="s1" variants={slide} initial="hidden" animate="visible" exit="exit" className="flex-1">
              <h2 className="heading-lg mb-1 flex items-center gap-2">
                What is your investment budget?
              </h2>
              <p className="text-muted text-sm mb-6">Select your approximate target range in INR.</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {BUDGETS.map((b) => {
                  const active = budgetMax === b.max && budgetMin === b.min;
                  return (
                    <button
                      key={b.label}
                      type="button"
                      onClick={() => setBudget(b.min, b.max, b.label)}
                      className={`wizard-option text-left p-4 rounded-2xl border transition-all duration-200 ${
                        active
                          ? "border-brand-600 bg-brand-50/50 shadow-sm ring-2 ring-brand-100"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30"
                      }`}
                    >
                      <p className="font-semibold text-slate-800 text-sm md:text-base">{b.label}</p>
                      <p className={`text-[11px] mt-0.5 ${active ? "text-brand-600" : "text-muted"}`}>{b.desc}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2 — Property Type */}
          {step === 2 && (
            <motion.div key="s2" variants={slide} initial="hidden" animate="visible" exit="exit" className="flex-1">
              <h2 className="heading-lg mb-1">What type of property fits your interest?</h2>
              <p className="text-muted text-sm mb-6">This helps us narrow down colonies with verified inventory.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PROPERTY_TYPES.map(({ type, label, icon: Icon, desc }) => {
                  const active = propertyType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPropertyType(type)}
                      className={`wizard-option flex flex-col items-center text-center gap-3 p-6 rounded-2xl border transition-all duration-200 ${
                        active
                          ? "border-brand-600 bg-brand-50/50 shadow-sm ring-2 ring-brand-100"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30"
                      }`}
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${active ? "bg-brand-100" : "bg-slate-100"}`}>
                        <Icon size={22} className={active ? "text-brand-600" : "text-slate-500"} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm md:text-base">{label}</p>
                        <p className={`text-[11px] mt-1 ${active ? "text-brand-600" : "text-muted"}`}>{desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 3 — Purpose */}
          {step === 3 && (
            <motion.div key="s3" variants={slide} initial="hidden" animate="visible" exit="exit" className="flex-1">
              <h2 className="heading-lg mb-1">What is your primary decision driver?</h2>
              <p className="text-muted text-sm mb-6">This shifts mathematical weights to compute matches.</p>
              <div className="flex flex-col gap-3">
                {PURPOSES.map(({ value, title, desc }) => {
                  const active = purpose === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPurpose(value)}
                      className={`wizard-option flex items-center justify-between gap-4 p-5 rounded-2xl border text-left transition-all duration-200 ${
                        active
                          ? "border-brand-600 bg-brand-50/50 shadow-sm ring-2 ring-brand-100"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30"
                      }`}
                    >
                      <div>
                        <p className="font-bold text-slate-800 text-sm md:text-base">{title}</p>
                        <p className={`text-[11px] mt-0.5 ${active ? "text-brand-600" : "text-muted"}`}>{desc}</p>
                      </div>
                      {active && <CheckCircle2 size={20} className="text-brand-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 4 — Lifestyle & Preferred Location */}
          {step === 4 && (
            <motion.div key="s4" variants={slide} initial="hidden" animate="visible" exit="exit" className="flex-1">
              <h2 className="heading-lg mb-1">Refine with Lifestyle & Location</h2>
              <p className="text-muted text-sm mb-6">Personalize your recommendation score parameters.</p>

              {/* Lifestyle Selection */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
                  Select Core Lifestyle Preference:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {LIFESTYLES.map((ls) => {
                    const active = lifestyle === ls.value;
                    return (
                      <button
                        key={ls.value}
                        type="button"
                        onClick={() => setLifestyle(ls.value)}
                        className={`text-left p-3 rounded-xl border text-xs transition-all duration-200 ${
                          active
                            ? "border-brand-600 bg-brand-50/40 font-semibold text-brand-700"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <p className="font-bold">{ls.label}</p>
                        <p className="text-[10px] text-muted font-normal mt-0.5">{ls.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Location Input */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Preferred Location (Optional):
                </label>
                <div className="relative mb-3">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    placeholder="Search by area name (e.g., Super Corridor, Vijay Nagar)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 text-sm"
                  />
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] text-muted uppercase font-semibold">Popular Areas:</span>
                  {POPULAR_LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setPreferredLocation(loc)}
                      className={`px-2.5 py-1 rounded-full border text-[11px] transition-colors ${
                        preferredLocation.toLowerCase() === loc.toLowerCase()
                          ? "bg-slate-800 border-slate-800 text-white font-medium"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5 — Loading Experience / AI Analysis */}
          {step === 5 && (
            <motion.div
              key="s5"
              variants={slide}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-1 flex flex-col items-center justify-center text-center py-6"
            >
              {/* Circular pulsate spinner */}
              <div className="relative mb-8 flex items-center justify-center">
                <div className="absolute h-20 w-20 rounded-full border-4 border-brand-100 animate-ping" />
                <div className="h-16 w-16 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin" />
              </div>
              <h2 className="heading-md mb-6 font-display font-bold text-slate-800">
                Compiling Indore&apos;s hyper-local real estate indices...
              </h2>
              
              {/* Checklist progress */}
              <div className="space-y-2.5 w-full max-w-sm mb-8">
                {ANALYSIS_STEPS.map((s, i) => (
                  <motion.div
                    key={s}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: i <= analysisStep ? 1 : 0.2, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-2.5 text-sm ${
                      i <= analysisStep ? "text-slate-700 font-medium" : "text-slate-300"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        i < analysisStep
                          ? "bg-trust-500 text-white"
                          : i === analysisStep
                          ? "bg-brand-600 text-white animate-pulse"
                          : "bg-slate-100 text-slate-300"
                      }`}
                    >
                      {i < analysisStep ? "✓" : "•"}
                    </span>
                    {s}
                  </motion.div>
                ))}
              </div>

              {/* Skeleton cards underneath to show incoming layout */}
              <div className="w-full opacity-40 select-none pointer-events-none mt-2">
                <SkeletonCard />
              </div>
            </motion.div>
          )}

          {/* Step 6 — Matches / Results */}
          {step === 6 && (
            <motion.div key="s6" variants={slide} initial="hidden" animate="visible" exit="exit" className="flex-1">
              <div className="mb-8 text-center bg-slate-50 border border-slate-100 rounded-3xl p-5 relative overflow-hidden">
                <div className="pointer-events-none absolute -left-10 -top-10 h-24 w-24 rounded-full bg-brand-600/5 blur-xl" />
                <div className="pointer-events-none absolute -right-10 -bottom-10 h-24 w-24 rounded-full bg-trust-600/5 blur-xl" />
                
                <h2 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 mb-1.5 flex items-center justify-center gap-2">
                  <Award className="text-brand-600" size={24} /> Your Personalized Top Matches
                </h2>
                <p className="text-muted text-xs leading-relaxed max-w-lg mx-auto">
                  Matched against a <span className="font-semibold text-slate-800">{budgetLabel}</span> budget,{" "}
                  <span className="font-semibold text-slate-800">{propertyType}</span> property, customized for{" "}
                  <span className="font-semibold text-slate-800">{purpose.replace("-", " ")}</span> and{" "}
                  <span className="font-semibold text-slate-800">{lifestyle.replace("-", " ")}</span> lifestyle.
                </p>
              </div>

              {/* Results Area Cards list */}
              <div className="space-y-5 mb-8">
                {results && results.length > 0 ? (
                  results.map((area) => (
                    <AreaRecommendationCard
                      key={area.slug}
                      {...area}
                      budgetLabel={budgetLabel}
                      onWhatsAppClick={handleWhatsAppClick}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                    <p className="text-sm font-semibold text-slate-800 mb-1">No matches found</p>
                    <p className="text-xs text-muted">Try adjusting your budget or selecting a different lifestyle parameter.</p>
                  </div>
                )}
              </div>

              {/* Session analytics footer */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 flex items-center justify-between text-[11px] text-slate-500 font-medium mb-6">
                <div className="flex items-center gap-1.5">
                  <Activity size={12} className="text-brand-500" />
                  <span>Anonymous Session Stats:</span>
                </div>
                <div className="flex gap-4">
                  <span>⚡ <span className="font-bold text-slate-700">{sessionStats.requests}</span> Requests</span>
                  <span>👁️ <span className="font-bold text-slate-700">{sessionStats.views}</span> Views</span>
                  <span>💬 <span className="font-bold text-slate-700">{sessionStats.clicks}</span> WhatsApp clicks</span>
                </div>
              </div>

              {/* Reset Start Over Button */}
              <button
                type="button"
                onClick={() => {
                  reset();
                  setResults([]);
                }}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold transition-all text-xs"
              >
                Start Over / Reset Search
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Navigation Actions Footer */}
      {step !== 5 && (
        <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1 || step === 6}
            className={`btn-ghost py-2.5 text-xs flex items-center gap-1 ${
              step === 1 || step === 6 ? "pointer-events-none opacity-0" : ""
            }`}
          >
            <ArrowLeft size={14} /> Back
          </button>

          {step < 4 && (
            <button
              type="button"
              onClick={nextStep}
              disabled={
                (step === 1 && !budgetMax) ||
                (step === 2 && !propertyType) ||
                (step === 3 && !purpose)
              }
              className="btn-primary py-2.5 text-xs flex items-center gap-1 hover:shadow disabled:opacity-50 disabled:pointer-events-none"
            >
              Continue <ArrowRight size={14} />
            </button>
          )}

          {step === 4 && (
            <button
              type="button"
              onClick={nextStep}
              disabled={!lifestyle}
              className="btn-primary py-2.5 text-xs flex items-center gap-1 bg-brand-600 hover:bg-brand-700 text-white font-bold disabled:opacity-50 disabled:pointer-events-none"
            >
              Calculate AI Recommendations <Sparkles size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
