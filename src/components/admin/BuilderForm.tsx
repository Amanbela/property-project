"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BuilderSchema, type Builder } from "@/shared/types/models";
import { 
  InputField, 
  TextAreaField, 
  CheckboxField,
  ArrayInputField,
  ReviewField,
  ImageField,
  CurationFieldSet
} from "./FormFields";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createBuilder, updateBuilder } from "@/actions/admin-builders";
import { Save, ArrowLeft, Loader2, Building2, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";

interface BuilderFormProps {
  initialData?: Partial<Builder>;
  isEdit?: boolean;
}

export function BuilderForm({ initialData, isEdit }: BuilderFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(BuilderSchema),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: (initialData as any) || {
      activeStatus: true,
      reputationScore: 0,
      completedProjects: 0,
      ongoingProjects: 0,
      reraVerified: false,
    },
  });

  const onSubmit = async (data: Builder) => {
    setIsSubmitting(true);
    try {
      const res = (isEdit && initialData?._id)
        ? await updateBuilder(initialData._id, data)
        : await createBuilder(data);

      if (res.ok) {
        toast.success(isEdit ? "Builder updated" : "Builder created");
        router.push("/admin/builders");
        router.refresh();
      } else {
        toast.error("Error saving builder");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl pb-20">
      <div className="flex items-center justify-between sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md py-4 border-b border-slate-200 -mx-4 px-4 sm:-mx-8 sm:px-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/builders" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">
              {isEdit ? `Edit ${initialData?.builderName}` : "Register New Builder"}
            </h1>
            <p className="text-xs text-slate-500">Builder Trust Management</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {isEdit ? "Save Changes" : "Register Builder"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-base p-6 space-y-6">
            <div className="flex items-center gap-2 text-brand-600">
              <Building2 size={20} />
              <h3 className="text-lg font-bold text-slate-800">Company Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Builder/Company Name"
                name="builderName"
                register={register}
                errors={errors}
                required
              />
              <ImageField
                label="Logo"
                name="logo"
                register={register}
                errors={errors}
                control={control}
              />
              <InputField
                label="Contact Number"
                name="contactNumber"
                register={register}
                errors={errors}
              />
              <InputField
                label="Email Address"
                name="email"
                type="email"
                register={register}
                errors={errors}
              />
            </div>
            <TextAreaField
              label="Company Overview"
              name="description"
              register={register}
              errors={errors}
              rows={4}
            />
          </div>

          <div className="card-base p-6 space-y-6">
            <div className="flex items-center gap-2 text-brand-600">
              <Star size={20} />
              <h3 className="text-lg font-bold text-slate-800">Track Record & Rating</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <InputField label="Reputation Score (0-10)" name="reputationScore" type="number" register={register} errors={errors} />
              <InputField label="Completed Projects" name="completedProjects" type="number" register={register} errors={errors} />
              <InputField label="Ongoing Projects" name="ongoingProjects" type="number" register={register} errors={errors} />
            </div>
          </div>

          <div className="card-base p-6">
            <ReviewField control={control} errors={errors} />
          </div>

          <CurationFieldSet 
            register={register} 
            errors={errors} 
            checklist={[
              { name: "identityVerified", label: "Identity & RERA Verified" },
              { name: "trackRecordVerified", label: "Project Track Record Verified" },
              { name: "legalCompliant", label: "Legal Compliance Confirmed" },
            ]}
          />
        </div>

        <div className="space-y-6">
          <div className="card-base p-6 space-y-4">
            <div className="flex items-center gap-2 text-brand-600">
              <ShieldCheck size={20} />
              <h3 className="text-lg font-bold text-slate-800">Verification</h3>
            </div>
            <CheckboxField label="RERA Verified" name="reraVerified" register={register} errors={errors} />
            <CheckboxField label="Active Listing" name="activeStatus" register={register} errors={errors} />
          </div>
        </div>
      </div>
    </form>
  );
}
