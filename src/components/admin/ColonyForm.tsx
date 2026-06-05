"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm, Controller, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColonySchema, type Colony } from "@/shared/types/models";
import { 
  InputField, 
  TextAreaField, 
  SelectField, 
  CheckboxField, 
  SeoFieldSet,
  ArrayInputField,
  FAQField,
  ImageField,
  CurationFieldSet
} from "./FormFields";
import { MultiImageUploader } from "./MultiImageUploader";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createColony, updateColony } from "@/actions/admin-colonies";
import { Save, ArrowLeft, Loader2, Sparkles, MapPin, Building2, ShieldCheck, Image as ImageIcon, Check, ChevronsUpDown, X, Search } from "lucide-react";
import Link from "next/link";

interface AreaOption {
  _id: string;
  name: string;
  slug: string;
}

interface ColonyFormProps {
  initialData?: Partial<Colony>;
  isEdit?: boolean;
}

export function ColonyForm({ initialData, isEdit }: ColonyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [areas, setAreas] = useState<AreaOption[]>([]);
  const [areasLoading, setAreasLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(ColonySchema),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: (initialData as any) || {
      published: true,
      possessionStatus: "Ready to Move",
      trafficCondition: "Moderate",
      investmentScore: 0,
      familyScore: 0,
      rentalDemand: 0,
      futureGrowthScore: 0,
      amenities: [],
      nearbySchools: [],
      nearbyHospitals: [],
      pros: [],
      cons: [],
      images: [],
    },
  });

  const { field: areaIdField } = useController({
    control,
    name: "areaId",
    defaultValue: initialData?.areaId ?? "",
  });

  const selectedArea = areas.find((a) => a._id === areaIdField.value);
  const selectedAreaName = selectedArea?.name ?? initialData?.areaName ?? "";

  useEffect(() => {
    fetch("/api/areas")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAreas(data);
      })
      .catch(() => {})
      .finally(() => setAreasLoading(false));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredAreas = areas.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = useCallback(
    (area: AreaOption) => {
      areaIdField.onChange(area._id);
      setValue("areaName", area.name);
      setDropdownOpen(false);
      setSearchQuery("");
    },
    [areaIdField, setValue]
  );

  const handleClear = useCallback(() => {
    areaIdField.onChange("");
    setValue("areaName", "");
    setSearchQuery("");
  }, [areaIdField, setValue]);

  const onSubmit = async (data: Colony) => {
    setIsSubmitting(true);
    try {
      const res = (isEdit && initialData?._id)
        ? await updateColony(initialData._id, data)
        : await createColony(data);

      if (res.ok) {
        toast.success(isEdit ? "Colony updated" : "Colony created");
        router.push("/admin/colonies");
        router.refresh();
      } else {
        toast.error("Error saving colony");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between sticky top-0 z-10 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md py-4 border-b border-slate-200 dark:border-slate-800 -mx-4 px-4 sm:-mx-8 sm:px-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/colonies" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {isEdit ? `Edit ${initialData?.colonyName}` : "Create New Colony"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Colony Intelligence Management</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {isEdit ? "Save Changes" : "Create Colony"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-base p-6 space-y-6">
            <div className="flex items-center gap-2 text-brand-600">
              <Building2 size={20} />
              <h3 className="text-lg font-bold text-slate-800">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Colony Name"
                name="colonyName"
                register={register}
                errors={errors}
                required
              />
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Area<span className="text-red-500">*</span>
                </label>
                <div className="relative" ref={dropdownRef}>
                  <div
                    className={`flex items-center w-full px-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm transition-all cursor-pointer ${
                      errors.areaId ? "border-red-500 bg-red-50 dark:bg-red-900/10" : "border-slate-200 dark:border-slate-700"
                    }`}
                    onClick={() => !areasLoading && setDropdownOpen(!dropdownOpen)}
                  >
                    {areasLoading ? (
                      <span className="text-slate-400 flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                        Loading areas...
                      </span>
                    ) : selectedAreaName ? (
                      <span className="flex-1 text-slate-900 dark:text-slate-100">{selectedAreaName}</span>
                    ) : (
                      <span className="flex-1 text-slate-400">Select area</span>
                    )}
                    {selectedAreaName && !areasLoading ? (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleClear(); }}
                        className="p-0.5 text-slate-400 hover:text-slate-600"
                      >
                        <X size={16} />
                      </button>
                    ) : null}
                    <ChevronsUpDown size={16} className="text-slate-400 ml-1 shrink-0" />
                  </div>

                  {dropdownOpen && (
                    <div className="absolute z-20 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 dark:border-slate-700">
                        <Search size={16} className="text-slate-400 shrink-0" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search areas..."
                          className="flex-1 bg-transparent text-sm outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredAreas.length === 0 ? (
                          <p className="px-4 py-6 text-sm text-slate-400 text-center">
                            {areas.length === 0 ? "No areas available. Create areas first." : "No areas found."}
                          </p>
                        ) : (
                          filteredAreas.map((area) => (
                            <button
                              type="button"
                              key={area._id}
                              onClick={() => handleSelect(area)}
                              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                                areaIdField.value === area._id ? "bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 font-medium" : "text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              <Check
                                size={16}
                                className={`shrink-0 ${
                                  areaIdField.value === area._id ? "opacity-100 text-brand-600" : "opacity-0"
                                }`}
                              />
                              {area.name}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {errors.areaId && (
                  <p className="text-xs text-red-500 font-medium">{errors.areaId?.message as string}</p>
                )}
              </div>
              <InputField
                label="Builder Name"
                name="builderName"
                register={register}
                errors={errors}
              />
              <SelectField
                label="Possession Status"
                name="possessionStatus"
                register={register}
                errors={errors}
                options={[
                  { label: "Ready to Move", value: "Ready to Move" },
                  { label: "Under Construction", value: "Under Construction" },
                  { label: "New Launch", value: "New Launch" },
                  { label: "Pre Launch", value: "Pre Launch" },
                ]}
              />
            </div>
            <TextAreaField
              label="Overview Description"
              name="description"
              register={register}
              errors={errors}
              rows={4}
              placeholder="Provide a detailed description of the colony..."
            />
          </div>

          <div className="card-base p-6 space-y-6">
            <div className="flex items-center gap-2 text-brand-600">
              <Sparkles size={20} />
              <h3 className="text-lg font-bold text-slate-800">Intelligence Scores</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InputField label="Investment" name="investmentScore" type="number" register={register} errors={errors} />
              <InputField label="Family" name="familyScore" type="number" register={register} errors={errors} />
              <InputField label="Rental" name="rentalDemand" type="number" register={register} errors={errors} />
              <InputField label="Growth" name="futureGrowthScore" type="number" register={register} errors={errors} />
            </div>
          </div>

          <div className="card-base p-6 space-y-6">
            <div className="flex items-center gap-2 text-brand-600">
              <ShieldCheck size={20} />
              <h3 className="text-lg font-bold text-slate-800">Market & Trust</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Avg Plot Price (₹/sq.ft)" name="averagePlotPrice" type="number" register={register} errors={errors} />
              <InputField label="Avg Flat Price (₹/sq.ft)" name="averageFlatPrice" type="number" register={register} errors={errors} />
              <SelectField
                label="Traffic Condition"
                name="trafficCondition"
                register={register}
                errors={errors}
                options={[
                  { label: "Low", value: "Low" },
                  { label: "Moderate", value: "Moderate" },
                  { label: "High", value: "High" },
                ]}
              />
              <InputField label="Legal Approval Status" name="legalApprovalStatus" register={register} errors={errors} />
            </div>
          </div>

          <div className="card-base p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Pros & Cons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ArrayInputField label="Pros" name="pros" register={register} errors={errors} control={control} />
              <ArrayInputField label="Cons" name="cons" register={register} errors={errors} control={control} />
            </div>
          </div>

          <div className="card-base p-6">
            <FAQField control={control} errors={errors} />
          </div>

          <CurationFieldSet 
            register={register} 
            errors={errors} 
            checklist={[
              { name: "legalApproved", label: "Legal Documents Verified" },
              { name: "reraApproved", label: "RERA Registration Valid" },
              { name: "possessionVerified", label: "Possession Timeline Verified" },
            ]}
          />

          <SeoFieldSet register={register} errors={errors} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card-base p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Publishing</h3>
            <CheckboxField label="RERA Verified" name="reraStatus" register={register} errors={errors} />
            <CheckboxField label="Published" name="published" register={register} errors={errors} />
          </div>

          <div className="card-base p-6 space-y-4">
            <div className="flex items-center gap-2 text-brand-600">
              <MapPin size={20} />
              <h3 className="text-lg font-bold text-slate-800">Location & Connectivity</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Latitude" name="geoLocation.lat" type="number" register={register} errors={errors} />
              <InputField label="Longitude" name="geoLocation.lng" type="number" register={register} errors={errors} />
            </div>
            <ArrayInputField label="Nearby Schools" name="nearbySchools" register={register} errors={errors} control={control} />
            <ArrayInputField label="Nearby Hospitals" name="nearbyHospitals" register={register} errors={errors} control={control} />
            <ArrayInputField label="Amenities" name="amenities" register={register} errors={errors} control={control} />
          </div>

          <div className="card-base p-6 space-y-4">
            <div className="flex items-center gap-2 text-brand-600">
              <ImageIcon size={20} />
              <h3 className="text-lg font-bold text-slate-800">Gallery</h3>
            </div>
            <Controller
              name="images"
              control={control}
              render={({ field }) => (
                <MultiImageUploader
                  values={field.value || []}
                  onChange={field.onChange}
                  label="Colony Images"
                />
              )}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
