"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AreaSchema, type Area } from "@/shared/types/models";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAreaDirect, updateAreaDirect } from "@/actions/admin-areas";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import { AreaBasicSection } from "@/components/admin/area/AreaBasicSection";
import { AreaPricingSection } from "@/components/admin/area/AreaPricingSection";
import { AreaIntelligenceSection } from "@/components/admin/area/AreaIntelligenceSection";
import { AreaPropertySection } from "@/components/admin/area/AreaPropertySection";
import { AreaLifestyleSection } from "@/components/admin/area/AreaLifestyleSection";
import { AreaConnectivitySection } from "@/components/admin/area/AreaConnectivitySection";
import { AreaFacilitiesSection } from "@/components/admin/area/AreaFacilitiesSection";
import { AreaColonySection } from "@/components/admin/area/AreaColonySection";
import { AreaProsConsSection } from "@/components/admin/area/AreaProsConsSection";
import { AreaSeoSection } from "@/components/admin/area/AreaSeoSection";
import { AreaStatusSection } from "@/components/admin/area/AreaStatusSection";

interface AreaFormProps {
  initialData?: Partial<Area>;
  isEdit?: boolean;
}

const defaultValues: Record<string, unknown> = {
  published: true,
  featured: false,
  averagePrice: 0,
  averagePricePerSqft: 0,
  investmentScore: 50,
  familyScore: 50,
  rentalDemand: 50,
  futureGrowth: 50,
  trafficScore: 50,
  trafficCondition: 50,
  nearbyMetro: false,
  budgetCategory: [],
  propertyTypes: [],
  tags: [],
  lifestyleTags: [],
  nearbySchools: [],
  nearbyHospitals: [],
  nearbyMalls: [],
  nearbyITHubs: [],
  pros: [],
  cons: [],
  gallery: [],
  suggestedColonies: [],
  connectivity: { metroDistanceKm: 0, airportDistanceKm: 0, railwayDistanceKm: 0 },
  coordinates: { lat: 22.7196, lng: 75.8577 },
};

export function AreaForm({ initialData, isEdit }: AreaFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, formState: { errors }, control } = useForm<any>({
    resolver: zodResolver(AreaSchema),
    defaultValues: (initialData || defaultValues),
  });

  const onSubmit = async (data: Area) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        suggestedColonies: Array.isArray(data.suggestedColonies)
          ? data.suggestedColonies
          : [],
      };

      const res = isEdit && initialData?._id
        ? await updateAreaDirect(initialData._id, payload as unknown as Record<string, unknown>)
        : await createAreaDirect(payload as unknown as Record<string, unknown>);

      if (res.ok) {
        toast.success(isEdit ? "Area updated successfully" : "Area created successfully");
        router.push("/admin/areas");
        router.refresh();
      } else {
        toast.error(res.error ? String(res.error) : "Error saving area");
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
              href="/admin/areas"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">
                {isEdit ? `Edit ${initialData?.name || "Area"}` : "Create New Area"}
              </h1>
              <p className="text-xs text-slate-500">Area Intelligence &amp; Recommendation Management</p>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Area"}
          </button>
        </div>
      </div>

      {/* Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <AreaBasicSection register={register} errors={errors} control={control} />
          <AreaIntelligenceSection register={register} errors={errors} />
          <AreaPropertySection register={register} errors={errors} />
          <AreaLifestyleSection register={register} errors={errors} control={control} />
          <AreaFacilitiesSection register={register} errors={errors} control={control} />
          <AreaColonySection register={register} errors={errors} control={control} />
          <AreaProsConsSection register={register} errors={errors} control={control} />
          <AreaSeoSection register={register} errors={errors} />
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-6">
          <AreaStatusSection register={register} errors={errors} />
          <AreaPricingSection register={register} errors={errors} control={control} />
          <AreaConnectivitySection register={register} errors={errors} />
        </div>
      </div>
    </form>
  );
}
