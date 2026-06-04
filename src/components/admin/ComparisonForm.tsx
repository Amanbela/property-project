"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createComparison, updateComparison } from "@/actions/admin-comparisons";
import { Save, ArrowLeft, Loader2, Plus, Trash2, Search, AlertTriangle } from "lucide-react";
import Link from "next/link";

const comparisonFormSchema = z.object({
  area1: z.string().min(1, "Area 1 is required"),
  area2: z.string().min(1, "Area 2 is required"),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
  heroHeading: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  introText: z.string().optional(),
  verdict: z.string().optional(),
  whoBuysHereArea1: z.string().optional(),
  whoBuysHereArea2: z.string().optional(),
  verdictForBudgets: z.array(z.object({
    budgetLabel: z.string(),
    recommendedArea: z.enum(["area1", "area2"]),
    reason: z.string()
  })).default([]),
  keyDifferences: z.array(z.object({
    parameter: z.string(),
    area1Value: z.string(),
    area2Value: z.string()
  })).default([]),
});



interface AreaOption {
  _id: string;
  name: string;
  slug: string;
}

interface ComparisonFormProps {
  areas: AreaOption[];
  initialData?: Record<string, unknown>;
  isEdit?: boolean;
}

export function ComparisonForm({ areas, initialData, isEdit }: ComparisonFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugPreview, setSlugPreview] = useState("");
  const [duplicateWarning, setDuplicateWarning] = useState<{ exists: boolean; slug?: string }>({ exists: false });

  const defaultValues: Record<string, unknown> = {
    area1: (initialData?.area1 as string) || (initialData?.area1 && typeof initialData.area1 === "object" ? (initialData.area1 as Record<string, unknown>)._id as string : ""),
    area2: (initialData?.area2 as string) || (initialData?.area2 && typeof initialData.area2 === "object" ? (initialData.area2 as Record<string, unknown>)._id as string : ""),
    isActive: initialData?.isActive !== undefined ? Boolean(initialData.isActive) : true,
    sortOrder: Number(initialData?.sortOrder ?? 0),
    heroHeading: (initialData?.heroHeading as string) || "",
    metaTitle: (initialData?.metaTitle as string) || "",
    metaDescription: (initialData?.metaDescription as string) || "",
    introText: (initialData?.introText as string) || "",
    verdict: (initialData?.verdict as string) || "",
    whoBuysHereArea1: initialData?.whoBuysHere
      ? ((initialData.whoBuysHere as Record<string, unknown>).area1Profile as string) || ""
      : "",
    whoBuysHereArea2: initialData?.whoBuysHere
      ? ((initialData.whoBuysHere as Record<string, unknown>).area2Profile as string) || ""
      : "",
    verdictForBudgets: (initialData?.verdictForBudgets as { budgetLabel: string; recommendedArea: "area1" | "area2"; reason: string }[]) || [],
    keyDifferences: (initialData?.keyDifferences as { parameter: string; area1Value: string; area2Value: string }[]) || [],
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<any>({
    resolver: zodResolver(comparisonFormSchema),
    defaultValues,
  });

  const area1Id = watch("area1");
  const area2Id = watch("area2");

  const selectedArea1 = areas.find((a) => a._id === area1Id);
  const selectedArea2 = areas.find((a) => a._id === area2Id);

  const {
    fields: budgetFields,
    append: appendBudget,
    remove: removeBudget,
  } = useFieldArray({ control, name: "verdictForBudgets" });

  const {
    fields: diffFields,
    append: appendDiff,
    remove: removeDiff,
  } = useFieldArray({ control, name: "keyDifferences" });

  // Update slug preview
  useEffect(() => {
    if (selectedArea1 && selectedArea2) {
      setSlugPreview(`${selectedArea1.slug}-vs-${selectedArea2.slug}`);
    } else {
      setSlugPreview("");
    }
  }, [selectedArea1, selectedArea2]);

  // Duplicate check
  useEffect(() => {
    if (!area1Id || !area2Id || area1Id === area2Id) {
      setDuplicateWarning({ exists: false });
      return;
    }
    const check = async () => {
      try {
        const res = await fetch(`/api/comparisons/check?area1=${area1Id}&area2=${area2Id}`);
        const data = await res.json();
        setDuplicateWarning(data);
      } catch {
        setDuplicateWarning({ exists: false });
      }
    };
    const timer = setTimeout(check, 500);
    return () => clearTimeout(timer);
  }, [area1Id, area2Id]);

  // SEO char counters
  const [metaTitle, setMetaTitle] = useState<string>(defaultValues.metaTitle as string || "");
  const [metaDesc, setMetaDesc] = useState<string>(defaultValues.metaDescription as string || "");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    if (data.area1 === data.area2) {
      toast.error("Area 1 and Area 2 must be different");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("area1", data.area1);
      formData.append("area2", data.area2);
      formData.append("isActive", String(data.isActive));
      formData.append("sortOrder", String(data.sortOrder));
      if (data.heroHeading) formData.append("heroHeading", data.heroHeading);
      if (data.metaTitle) formData.append("metaTitle", data.metaTitle);
      if (data.metaDescription) formData.append("metaDescription", data.metaDescription);
      if (data.introText) formData.append("introText", data.introText);
      if (data.verdict) formData.append("verdict", data.verdict);
      if (data.whoBuysHereArea1 || data.whoBuysHereArea2) {
        formData.append("whoBuysHere", JSON.stringify({
          area1Profile: data.whoBuysHereArea1 || "",
          area2Profile: data.whoBuysHereArea2 || "",
        }));
      }
      const budgets = data.verdictForBudgets as Array<{ budgetLabel: string; recommendedArea: string; reason: string }>;
      budgets.forEach((item, i) => {
        formData.append(`verdictForBudgets[${i}][budgetLabel]`, item.budgetLabel);
        formData.append(`verdictForBudgets[${i}][recommendedArea]`, item.recommendedArea);
        formData.append(`verdictForBudgets[${i}][reason]`, item.reason);
      });
      const diffs = data.keyDifferences as Array<{ parameter: string; area1Value: string; area2Value: string }>;
      diffs.forEach((item, i) => {
        formData.append(`keyDifferences[${i}][parameter]`, item.parameter);
        formData.append(`keyDifferences[${i}][area1Value]`, item.area1Value);
        formData.append(`keyDifferences[${i}][area2Value]`, item.area2Value);
      });

      if (isEdit && initialData?._id) {
        const res = await updateComparison(initialData._id as string, {}, formData);
        if (res.ok) {
          toast.success("Comparison updated successfully");
          router.push("/admin/comparisons");
        } else {
          toast.error(res.error ? String(res.error) : "Error updating comparison");
        }
      } else {
        const res = await createComparison({}, formData);
        if (res.ok) {
          toast.success("Comparison created successfully");
          router.push("/admin/comparisons");
        } else {
          toast.error(res.error ? String(res.error) : "Error creating comparison");
        }
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-6xl pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 -mx-4 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/comparisons"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">
                {isEdit ? `Edit Comparison` : "Create New Comparison"}
              </h1>
              <p className="text-xs text-slate-500">Side-by-side area comparison management</p>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Comparison"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1 — Select Areas */}
          <div className="card-base p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Search size={18} className="text-brand-600" />
              <h3 className="text-lg font-bold text-slate-800">Select Areas</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Area 1 *</label>
                <select
                  {...register("area1")}
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                    errors.area1 ? "border-red-500 bg-red-50" : "border-slate-200"
                  }`}
                >
                  <option value="">Select area 1</option>
                  {areas.map((a) => (
                    <option key={a._id} value={a._id} disabled={a._id === area2Id}>
                      {a.name} ({a.slug})
                    </option>
                  ))}
                </select>
                {errors.area1 && <p className="text-xs text-red-500 font-medium">{errors.area1.message as string}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Area 2 *</label>
                <select
                  {...register("area2")}
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                    errors.area2 ? "border-red-500 bg-red-50" : "border-slate-200"
                  }`}
                >
                  <option value="">Select area 2</option>
                  {areas.map((a) => (
                    <option key={a._id} value={a._id} disabled={a._id === area1Id}>
                      {a.name} ({a.slug})
                    </option>
                  ))}
                </select>
                {errors.area2 && <p className="text-xs text-red-500 font-medium">{errors.area2.message as string}</p>}
              </div>
            </div>

            {slugPreview && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5">
                <p className="text-xs text-slate-500 font-medium">Slug will be:</p>
                <p className="text-sm font-mono text-brand-600">{slugPreview}</p>
              </div>
            )}

            {duplicateWarning.exists && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-start gap-3">
                <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">This comparison already exists</p>
                  {duplicateWarning.slug && (
                    <Link
                      href={`/areas/compare/${duplicateWarning.slug}`}
                      className="text-xs text-amber-600 underline hover:text-amber-800"
                      target="_blank"
                    >
                      View /areas/compare/{duplicateWarning.slug}
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section 2 — SEO */}
          <div className="card-base p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Search size={18} className="text-brand-600" />
              <h3 className="text-lg font-bold text-slate-800">SEO & Search Optimization</h3>
            </div>
            <p className="text-sm text-slate-500">
              Leave blank to auto-generate from area names.
            </p>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Hero Heading (H1)</label>
              </div>
              <input
                type="text"
                {...register("heroHeading")}
                placeholder={selectedArea1 && selectedArea2 ? `${selectedArea1.name} vs ${selectedArea2.name}: Which Area to Buy in Indore?` : "Auto-generated from area names"}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <p className="text-[10px] text-slate-400">Leave blank to auto-generate from area names</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">Meta Title</label>
                  <span className={`text-xs font-mono ${metaTitle.length > 60 ? "text-red-500" : metaTitle.length > 50 ? "text-amber-500" : "text-slate-400"}`}>
                    {metaTitle.length}/60
                  </span>
                </div>
                <input
                  type="text"
                  {...register("metaTitle")}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={selectedArea1 && selectedArea2 ? `${selectedArea1.name} vs ${selectedArea2.name} Property Comparison | AreaMatch` : ""}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                <p className="text-[10px] text-slate-400">Leave blank to auto-generate from area names</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">Meta Description</label>
                  <span className={`text-xs font-mono ${metaDesc.length > 160 ? "text-red-500" : metaDesc.length > 140 ? "text-amber-500" : "text-slate-400"}`}>
                    {metaDesc.length}/160
                  </span>
                </div>
                <textarea
                  rows={2}
                  {...register("metaDescription")}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  placeholder="Auto-generated from area names"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
                />
                <p className="text-[10px] text-slate-400">Leave blank to auto-generate from area names</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Intro Text</label>
              <textarea
                rows={2}
                {...register("introText")}
                placeholder="Brief 2-3 sentence introduction shown below the H1"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
              />
              <p className="text-[10px] text-slate-400">Leave blank to skip intro text</p>
            </div>
          </div>

          {/* Section 3 — Verdict */}
          <div className="card-base p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Verdict</h3>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Overall Verdict</label>
              <textarea
                rows={2}
                {...register("verdict")}
                placeholder='e.g. "Vijay Nagar is better for families, Super Corridor for investors"'
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Who Should Buy — Area 1</label>
                <textarea
                  rows={2}
                  {...register("whoBuysHereArea1")}
                  placeholder='e.g. "Middle-class families, govt employees"'
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Who Should Buy — Area 2</label>
                <textarea
                  rows={2}
                  {...register("whoBuysHereArea2")}
                  placeholder='e.g. "IT professionals, investors"'
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4 — Verdict by Budget */}
          <div className="card-base p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Verdict by Budget</h3>
              <button
                type="button"
                onClick={() => appendBudget({ budgetLabel: "", recommendedArea: "area1", reason: "" })}
                className="text-brand-600 hover:text-brand-700 flex items-center gap-1 text-xs font-bold"
              >
                <Plus size={14} /> Add Row
              </button>
            </div>

            <div className="space-y-3">
              {budgetFields.map((field, index) => (
                <div key={field.id} className="relative flex flex-col md:flex-row gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 group">
                  <button
                    type="button"
                    onClick={() => removeBudget(index)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="flex-1 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Budget Label</label>
                    <input
                      {...register(`verdictForBudgets.${index}.budgetLabel`)}
                      placeholder="e.g. Under ₹50L"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Recommended</label>
                    <select
                      {...register(`verdictForBudgets.${index}.recommendedArea`)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    >
                      <option value="area1">{selectedArea1?.name || "Area 1"}</option>
                      <option value="area2">{selectedArea2?.name || "Area 2"}</option>
                    </select>
                  </div>
                  <div className="flex-[2] space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Reason</label>
                    <input
                      {...register(`verdictForBudgets.${index}.reason`)}
                      placeholder="e.g. because prices are lower"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>
              ))}
              {budgetFields.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4 border-2 border-dashed border-slate-100 rounded-2xl">
                  No budget rows added yet.
                </p>
              )}
            </div>
          </div>

          {/* Section 5 — Key Differences */}
          <div className="card-base p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Key Differences</h3>
              <button
                type="button"
                onClick={() => appendDiff({ parameter: "", area1Value: "", area2Value: "" })}
                className="text-brand-600 hover:text-brand-700 flex items-center gap-1 text-xs font-bold"
              >
                <Plus size={14} /> Add Row
              </button>
            </div>
            <p className="text-xs text-slate-400">Pre-populated hints: Avg Price/sqft, Overall Score, Metro Distance</p>

            <div className="space-y-3">
              {diffFields.map((field, index) => (
                <div key={field.id} className="relative flex flex-col md:flex-row gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 group">
                  <button
                    type="button"
                    onClick={() => removeDiff(index)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="flex-1 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Parameter</label>
                    <input
                      {...register(`keyDifferences.${index}.parameter`)}
                      placeholder="e.g. Avg Price/sqft"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">{selectedArea1?.name || "Area 1"} Value</label>
                    <input
                      {...register(`keyDifferences.${index}.area1Value`)}
                      placeholder="e.g. ₹4,200"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">{selectedArea2?.name || "Area 2"} Value</label>
                    <input
                      {...register(`keyDifferences.${index}.area2Value`)}
                      placeholder="e.g. ₹5,800"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>
              ))}
              {diffFields.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4 border-2 border-dashed border-slate-100 rounded-2xl">
                  No key differences added yet. A fallback table with live area scores will be shown.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-6">
          {/* Section 6 — Status */}
          <div className="card-base p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Status</h3>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                {...register("isActive")}
                className="w-5 h-5 rounded-lg border-slate-300 bg-white text-brand-600 focus:ring-brand-500/20"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer">
                Is Active
              </label>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Sort Order</label>
              <input
                type="number"
                {...register("sortOrder")}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
