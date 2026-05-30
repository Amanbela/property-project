"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AgentSchema, type Agent } from "@/shared/types/models";
import { 
  InputField, 
  TextAreaField, 
  SelectField, 
  CheckboxField,
  ArrayInputField,
  ImageField,
  CurationFieldSet
} from "./FormFields";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAgent, updateAgent } from "@/actions/admin-agents";
import { Save, ArrowLeft, Loader2, UserCheck, Phone, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";

interface AgentFormProps {
  initialData?: Partial<Agent>;
  isEdit?: boolean;
}

export function AgentForm({ initialData, isEdit }: AgentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(AgentSchema),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: (initialData as any) || {
      verifiedStatus: "pending",
      activeStatus: true,
      experience: 0,
      rating: 0,
      responseTime: 0,
      totalDealsClosed: 0,
      specializationAreas: [],
      colonyCoverage: [],
    },
  });

  const onSubmit = async (data: Agent) => {
    setIsSubmitting(true);
    try {
      const res = (isEdit && initialData?._id)
        ? await updateAgent(initialData._id, data)
        : await createAgent(data);

      if (res.ok) {
        toast.success(isEdit ? "Agent updated" : "Agent registered");
        router.push("/admin/agents");
        router.refresh();
      } else {
        toast.error("Error saving agent");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl pb-20">
      <div className="flex items-center justify-between sticky top-0 z-10 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md py-4 border-b border-slate-200 dark:border-slate-800 -mx-4 px-4 sm:-mx-8 sm:px-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/agents" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {isEdit ? `Edit ${initialData?.name}` : "Register New Agent"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Agent Verification Management</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {isEdit ? "Update Profile" : "Register Agent"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-base p-6 space-y-6">
            <div className="flex items-center gap-2 text-brand-600">
              <UserCheck size={20} />
              <h3 className="text-lg font-bold text-slate-800">Agent Profile</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Full Name"
                name="name"
                register={register}
                errors={errors}
                required
              />
              <InputField
                label="Phone Number"
                name="phone"
                register={register}
                errors={errors}
                required
              />
              <InputField
                label="Company Name"
                name="companyName"
                register={register}
                errors={errors}
              />
              <ImageField
                label="Profile Image"
                name="profileImage"
                register={register}
                errors={errors}
                control={control}
              />
            </div>
            <TextAreaField
              label="Professional Bio"
              name="bio"
              register={register}
              errors={errors}
              rows={4}
            />
          </div>

          <div className="card-base p-6 space-y-6">
            <div className="flex items-center gap-2 text-brand-600">
              <Briefcase size={20} />
              <h3 className="text-lg font-bold text-slate-800">Experience & Performance</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InputField label="Experience (Years)" name="experience" type="number" register={register} errors={errors} />
              <InputField label="Rating (0-5)" name="rating" type="number" register={register} errors={errors} />
              <InputField label="Response Time (Min)" name="responseTime" type="number" register={register} errors={errors} />
              <InputField label="Deals Closed" name="totalDealsClosed" type="number" register={register} errors={errors} />
            </div>
          </div>

          <div className="card-base p-6 space-y-6">
            <div className="flex items-center gap-2 text-brand-600">
              <MapPin size={20} />
              <h3 className="text-lg font-bold text-slate-800">Coverage & Specialization</h3>
            </div>
            <ArrayInputField label="Specialization Areas" name="specializationAreas" register={register} errors={errors} control={control} placeholder="e.g. Luxury, Residential, Commercial" />
            <ArrayInputField label="Colony Coverage (IDs)" name="colonyCoverage" register={register} errors={errors} control={control} placeholder="Enter colony IDs separated by commas" />
          </div>

          <CurationFieldSet 
            register={register} 
            errors={errors} 
            checklist={[
              { name: "identityVerified", label: "Government ID Verified" },
              { name: "reraRegistered", label: "RERA Registration Verified" },
              { name: "experienceVerified", label: "Claimed Experience Verified" },
            ]}
          />
        </div>

        <div className="space-y-6">
          <div className="card-base p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Status</h3>
            <SelectField
              label="Verification Status"
              name="verifiedStatus"
              register={register}
              errors={errors}
              options={[
                { label: "Pending", value: "pending" },
                { label: "Verified", value: "verified" },
                { label: "Rejected", value: "rejected" },
              ]}
            />
            <CheckboxField label="Active Profile" name="activeStatus" register={register} errors={errors} />
          </div>
        </div>
      </div>
    </form>
  );
}
