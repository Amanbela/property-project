"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogSchema, type Blog } from "@/shared/types/models";
import { 
  InputField, 
  TextAreaField, 
  SelectField, 
  SeoFieldSet,
  ArrayInputField,
  FAQField,
  ImageField
} from "./FormFields";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, ArrowLeft, Loader2, FileText, Globe, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

interface BlogFormProps {
  initialData?: Blog;
  isEdit?: boolean;
}

export function BlogForm({ initialData, isEdit }: BlogFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(BlogSchema),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: (initialData as any) || {
      status: "draft",
      category: "Property Insight",
      keywords: [],
      relatedSlugs: [],
      faqs: [],
    },
  });

  const onSubmit = async (data: Blog) => {
    setIsSubmitting(true);
    try {
      // Server action logic would go here
      toast.success(isEdit ? "Blog updated" : "Blog published");
      router.push("/admin/blogs");
      router.refresh();
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
          <Link href="/admin/blogs" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">
              {isEdit ? `Edit ${initialData?.title}` : "Write New Article"}
            </h1>
            <p className="text-xs text-slate-500">Blog Content Management System</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {isEdit ? "Save Article" : "Publish Article"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-base p-6 space-y-6">
            <div className="flex items-center gap-2 text-brand-600">
              <FileText size={20} />
              <h3 className="text-lg font-bold text-slate-800">Article Content</h3>
            </div>
            <InputField
              label="Article Title"
              name="title"
              register={register}
              errors={errors}
              required
              placeholder="e.g. Best areas to invest in Indore 2024"
            />
            <TextAreaField
              label="Short Excerpt"
              name="excerpt"
              register={register}
              errors={errors}
              rows={3}
              placeholder="Brief summary for list views..."
            />
            <TextAreaField
              label="Main Content (Markdown)"
              name="content"
              register={register}
              errors={errors}
              rows={15}
              placeholder="Write your article content here..."
            />
          </div>

          <div className="card-base p-6">
            <FAQField control={control} errors={errors} />
          </div>

          <SeoFieldSet register={register} errors={errors} />
        </div>

        <div className="space-y-6">
          <div className="card-base p-6 space-y-4">
            <div className="flex items-center gap-2 text-brand-600">
              <Globe size={20} />
              <h3 className="text-lg font-bold text-slate-800">Publishing</h3>
            </div>
            <SelectField
              label="Status"
              name="status"
              register={register}
              errors={errors}
              options={[
                { label: "Draft", value: "draft" },
                { label: "Published", value: "published" },
              ]}
            />
            <SelectField
              label="Category"
              name="category"
              register={register}
              errors={errors}
              options={[
                { label: "Property Insight", value: "Property Insight" },
                { label: "Area Guide", value: "Area Guide" },
                { label: "Investment Tips", value: "Investment Tips" },
                { label: "News", value: "News" },
              ]}
            />
          </div>

          <div className="card-base p-6 space-y-4">
            <div className="flex items-center gap-2 text-brand-600">
              <ImageIcon size={20} />
              <h3 className="text-lg font-bold text-slate-800">Featured Media</h3>
            </div>
            <ImageField label="Featured Image" name="featuredImage" register={register} errors={errors} control={control} />
            <ArrayInputField label="Keywords" name="keywords" register={register} errors={errors} control={control} />
            <ArrayInputField label="Related Slugs" name="relatedSlugs" register={register} errors={errors} control={control} />
          </div>
        </div>
      </div>
    </form>
  );
}
