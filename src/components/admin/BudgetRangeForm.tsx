"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BudgetRangeSchema, type BudgetRange } from "@/shared/types/models";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createBudgetRangeDirect, updateBudgetRangeDirect } from "@/actions/admin-budget-ranges";
import { Save, ArrowLeft, Loader2, IndianRupee, Search, MapPin, Info } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/utils/slug";
import { formatInr } from "@/utils/format";

interface BudgetRangeFormProps {
  initialData?: Partial<BudgetRange>;
  isEdit?: boolean;
}

interface AreaOption {
  _id: string;
  name: string;
  slug: string;
}

const defaultValues: Record<string, unknown> = {
  label: "",
  slug: "",
  minPrice: 0,
  maxPrice: 999999999,
  description: "",
  heroHeading: "",
  metaTitle: "",
  metaDescription: "",
  recommendedAreas: [],
  whyThisBudget: "",
  tipForBuyers: "",
  isActive: true,
  sortOrder: 0,
};

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(0)} L`;
  return `₹${price.toLocaleString()}`;
}

export function BudgetRangeForm({ initialData, isEdit }: BudgetRangeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [areas, setAreas] = useState<AreaOption[]>([]);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Strip Mongoose-only fields that would poison Zod validation:
  // _id, createdAt, updatedAt are NOT registered form fields. If left in
  // defaultValues they appear in the resolver payload where z.date() rejects
  // their JSON-serialized string form, causing silent validation failure.
  const formDefaults = React.useMemo(() => {
    if (!initialData) return defaultValues;
    const { _id, createdAt, updatedAt, ...rest } = initialData;
    return Object.keys(rest).length > 0 ? rest : defaultValues;
  }, [initialData]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, formState: { errors }, control, watch, setValue } = useForm<any>({
    resolver: zodResolver(BudgetRangeSchema),
    defaultValues: formDefaults,
  });

  const watchedLabel = watch("label");
  const watchedSlug = watch("slug");
  const watchedMinPrice = watch("minPrice");
  const watchedMaxPrice = watch("maxPrice");
  const watchedMetaTitle = watch("metaTitle") || "";
  const watchedMetaDesc = watch("metaDescription") || "";

  // Auto-generate slug from label
  useEffect(() => {
    if (!slugManuallyEdited && watchedLabel && !isEdit) {
      setValue("slug", slugify(watchedLabel));
    }
  }, [watchedLabel, slugManuallyEdited, isEdit, setValue]);

  // Fetch all areas for the multi-select
  useEffect(() => {
    fetch("/api/areas")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAreas(data);
      })
      .catch(() => {});
  }, []);

  const onSubmit = async (data: BudgetRange) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        recommendedAreas: Array.isArray(data.recommendedAreas)
          ? data.recommendedAreas
          : [],
      };

      const res = isEdit && initialData?._id
        ? await updateBudgetRangeDirect(initialData._id, payload as unknown as Record<string, unknown>)
        : await createBudgetRangeDirect(payload as unknown as Record<string, unknown>);

      if (res.ok) {
        toast.success(isEdit ? "Budget range updated successfully" : "Budget range created successfully");
        router.push("/admin/budget-ranges");
        router.refresh();
      } else {
        toast.error(res.error ? String(res.error) : "Error saving budget range");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = () => {
    toast.error("Please fix the form errors before saving");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8 max-w-6xl pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 -mx-4 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/budget-ranges"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">
                {isEdit ? `Edit ${initialData?.label || "Budget Range"}` : "Create New Budget Range"}
              </h1>
              <p className="text-xs text-slate-500">Budget-based area recommendation management</p>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Budget Range"}
          </button>
        </div>
      </div>

      {/* Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2/3) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Section 1: Basic Info */}
          <div className="card-base p-6 space-y-6">
            <div className="flex items-center gap-2 text-brand-600">
              <Info size={20} />
              <h3 className="text-lg font-bold text-slate-800">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Label *</label>
                <input
                  type="text"
                  {...register("label")}
                  placeholder="e.g. Under ₹30 Lakh"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                {errors.label && <p className="text-xs text-red-500 font-medium">{errors.label?.message as string}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Slug</label>
                <input
                  type="text"
                  {...register("slug")}
                  onChange={(e) => {
                    setValue("slug", e.target.value);
                    setSlugManuallyEdited(true);
                  }}
                  placeholder="auto-generated-from-label"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                {errors.slug && <p className="text-xs text-red-500 font-medium">{errors.slug?.message as string}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Sort Order</label>
                <input
                  type="number"
                  {...register("sortOrder", { valueAsNumber: true })}
                  placeholder="0"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                {errors.sortOrder && <p className="text-xs text-red-500 font-medium">{errors.sortOrder?.message as string}</p>}
              </div>

              <div className="flex items-center gap-3 pt-7">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register("isActive")}
                  className="w-5 h-5 rounded-lg border-slate-300 bg-white text-brand-600 focus:ring-brand-500/20"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Active (visible on public site)
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Price Range */}
          <div className="card-base p-6 space-y-6">
            <div className="flex items-center gap-2 text-brand-600">
              <IndianRupee size={20} />
              <h3 className="text-lg font-bold text-slate-800">Price Range</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Min Price (₹)</label>
                <input
                  type="number"
                  {...register("minPrice", { valueAsNumber: true })}
                  placeholder="0"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                <p className="text-xs text-slate-400">Enter 0 for no minimum</p>
                {errors.minPrice && <p className="text-xs text-red-500 font-medium">{errors.minPrice?.message as string}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Max Price (₹)</label>
                <input
                  type="number"
                  {...register("maxPrice", { valueAsNumber: true })}
                  placeholder="999999999"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                <p className="text-xs text-slate-400">Enter 999999999 for no upper limit</p>
                {errors.maxPrice && <p className="text-xs text-red-500 font-medium">{errors.maxPrice?.message as string}</p>}
              </div>
            </div>

            {watchedMinPrice !== undefined && watchedMaxPrice !== undefined && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-700">
                  Covers properties from <span className="font-bold text-brand-600">{formatPrice(Number(watchedMinPrice) || 0)}</span>
                  {" "}to{" "}
                  <span className="font-bold text-brand-600">
                    {Number(watchedMaxPrice) >= 999999999 ? "no upper limit" : formatPrice(Number(watchedMaxPrice) || 0)}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Page Content */}
          <div className="card-base p-6 space-y-6">
            <div className="flex items-center gap-2 text-brand-600">
              <Info size={20} />
              <h3 className="text-lg font-bold text-slate-800">Page Content</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Hero Heading</label>
                <input
                  type="text"
                  {...register("heroHeading")}
                  placeholder="e.g. Best Areas in Indore Under ₹30 Lakh"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                {errors.heroHeading && <p className="text-xs text-red-500 font-medium">{errors.heroHeading?.message as string}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  {...register("description")}
                  placeholder="1-2 sentences shown on the public budget page"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
                />
                {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description?.message as string}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Why This Budget</label>
                <textarea
                  rows={3}
                  {...register("whyThisBudget")}
                  placeholder="2-3 lines explaining what this budget can buy in Indore"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
                />
                {errors.whyThisBudget && <p className="text-xs text-red-500 font-medium">{errors.whyThisBudget?.message as string}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Tip For Buyers</label>
                <input
                  type="text"
                  {...register("tipForBuyers")}
                  placeholder="Short tip shown on the page"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                {errors.tipForBuyers && <p className="text-xs text-red-500 font-medium">{errors.tipForBuyers?.message as string}</p>}
              </div>
            </div>
          </div>

          {/* Section 4: SEO */}
          <div className="card-base p-6 space-y-6">
            <div className="flex items-center gap-2 text-brand-600">
              <Search size={20} />
              <h3 className="text-lg font-bold text-slate-800">SEO &amp; Search Optimization</h3>
            </div>
            <p className="text-sm text-slate-500">
              Optimize how this budget range page appears in search results.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">Meta Title</label>
                  <span className={`text-xs font-mono ${watchedMetaTitle.length > 60 ? "text-red-500" : watchedMetaTitle.length > 50 ? "text-amber-500" : "text-slate-400"}`}>
                    {watchedMetaTitle.length}/60
                  </span>
                </div>
                <input
                  type="text"
                  {...register("metaTitle")}
                  placeholder="Best Areas in Indore Under ₹30 Lakh"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                {errors.metaTitle && <p className="text-xs text-red-500 font-medium">{errors.metaTitle?.message as string}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">Meta Description</label>
                  <span className={`text-xs font-mono ${watchedMetaDesc.length > 160 ? "text-red-500" : watchedMetaDesc.length > 140 ? "text-amber-500" : "text-slate-400"}`}>
                    {watchedMetaDesc.length}/160
                  </span>
                </div>
                <textarea
                  rows={2}
                  {...register("metaDescription")}
                  placeholder="Discover the best areas in Indore under ₹30 Lakh. Find top localities, property prices, and investment opportunities."
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
                />
                {errors.metaDescription && <p className="text-xs text-red-500 font-medium">{errors.metaDescription?.message as string}</p>}
              </div>
            </div>

            {/* SEO Preview */}
            {watchedMetaTitle || watchedMetaDesc ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Search Result Preview</p>
                <p className="text-sm text-blue-700 font-medium truncate">{watchedMetaTitle || "Budget Range — Property Guide"}</p>
                <p className="text-xs text-green-800 truncate">https://indorepropertybudgetfinder.com/budget/{watchedSlug || "range-slug"}</p>
                <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{watchedMetaDesc || "Budget-based area guide for Indore..."}</p>
              </div>
            ) : null}
          </div>

          {/* Section 5: Linked Areas */}
          <div className="card-base p-6 space-y-6">
            <div className="flex items-center gap-2 text-brand-600">
              <MapPin size={20} />
              <h3 className="text-lg font-bold text-slate-800">Linked Areas</h3>
            </div>
            <p className="text-sm text-slate-500">
              Select areas that belong to this budget range. These areas will be shown on the public budget page.
            </p>

            <Controller
              name="recommendedAreas"
              control={control}
              render={({ field }) => {
                const selected: string[] = field.value ?? [];
                return (
                  <>
                    {areas.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {areas.map((area) => {
                          const isSelected = selected.includes(area._id);
                          return (
                            <label
                              key={area._id}
                              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                                isSelected
                                  ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500/20"
                                  : "border-slate-200 bg-white hover:border-slate-300"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {
                                  const next = isSelected
                                    ? selected.filter((id) => id !== area._id)
                                    : [...selected, area._id];
                                  field.onChange(next);
                                }}
                                className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-800">{area.name}</p>
                                <p className="text-xs text-slate-400">{area.slug}</p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
                        <MapPin size={24} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm text-slate-400">
                          No areas available.{" "}
                          <a href="/admin/areas/create" className="text-brand-600 underline">
                            Create areas first
                          </a>
                        </p>
                      </div>
                    )}

                    <div className="text-xs text-slate-400">
                      {selected.length} area{selected.length !== 1 ? "s" : ""} linked
                    </div>

                    {errors.recommendedAreas && (
                      <p className="text-xs text-red-500 font-medium">{errors.recommendedAreas?.message as string}</p>
                    )}
                  </>
                );
              }}
            />
          </div>
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-6">
          {/* Status summary */}
          <div className="card-base p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Status</h3>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive-sidebar"
                {...register("isActive")}
                className="w-5 h-5 rounded-lg border-slate-300 bg-white text-brand-600 focus:ring-brand-500/20"
              />
              <label htmlFor="isActive-sidebar" className="text-sm font-medium text-slate-700 cursor-pointer">
                Active
              </label>
            </div>
          </div>

          {/* Price Summary */}
          <div className="card-base p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Price Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Min Price</span>
                <span className="font-semibold">{formatPrice(Number(watchedMinPrice) || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Max Price</span>
                <span className="font-semibold">
                  {Number(watchedMaxPrice) >= 999999999 ? "No Limit" : formatPrice(Number(watchedMaxPrice) || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
