"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogSchema, type Blog } from "@/shared/types/models";
import { InputField, TextAreaField, SelectField, ImageField, ArrayInputField, FAQField } from "./FormFields";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createBlog } from "@/actions/admin-blogs";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/utils/slug";

interface BlogCreateFormProps {
  initialData?: Partial<Blog>;
  isEdit?: boolean;
  blogId?: string;
}

export function BlogCreateForm({ initialData, isEdit, blogId }: BlogCreateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, formState: { errors }, control, watch } = useForm<any>({
    resolver: zodResolver(BlogSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      category: initialData?.category || "Property Insight",
      featuredImage: initialData?.featuredImage || { imageUrl: "", publicId: "" },
      seoTitle: initialData?.seoTitle || "",
      seoDescription: initialData?.seoDescription || "",
      keywords: initialData?.keywords || [],
      schemaType: initialData?.schemaType || "Article",
      status: (initialData?.status as "draft" | "published") || "draft",
      relatedSlugs: initialData?.relatedSlugs || [],
      faqs: initialData?.faqs || [],
    },
  });

  const watchedTitle = watch("title");
  const watchedSlug = watch("slug");

  const autoSlug = React.useMemo(() => {
    if (watchedSlug) return watchedSlug;
    return watchedTitle ? slugify(watchedTitle) : "";
  }, [watchedTitle, watchedSlug]);

  const onSubmit = async (data: Blog) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        slug: data.slug || slugify(data.title),
      };
      const res = isEdit && blogId
        ? await (await import("@/actions/admin-blogs")).updateBlog(blogId, payload)
        : await createBlog(payload);

      if (res.ok) {
        toast.success(isEdit ? "Blog updated" : "Blog created");
        router.push("/admin/blogs");
        router.refresh();
      } else {
        const errMsg = typeof res.error === "string" ? res.error : JSON.stringify(res.error);
        toast.error(errMsg);
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl pb-20">
      <div className="flex items-center justify-between sticky top-0 z-10 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md py-4 border-b border-slate-200 dark:border-slate-800 -mx-4 px-4 sm:-mx-8 sm:px-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/blogs" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {isEdit ? "Edit Blog" : "Create Blog"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Content Management</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {isEdit ? "Update Blog" : "Create Blog"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-base p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Content</h3>
            <InputField label="Title" name="title" register={register} errors={errors} required />
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Slug
              </label>
              <div className="relative">
                <input
                  {...register("slug")}
                  placeholder={autoSlug || "Auto-generated from title"}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:bg-slate-800 dark:border-slate-700"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                  {autoSlug ? `/${autoSlug}` : ""}
                </span>
              </div>
              {errors.slug && <p className="text-xs text-red-500 font-medium">{errors.slug.message as string}</p>}
            </div>
            <TextAreaField label="Excerpt" name="excerpt" register={register} errors={errors} rows={2} />
            <TextAreaField label="Content (Markdown)" name="content" register={register} errors={errors} rows={14} />
          </div>

          <div className="card-base p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800">SEO</h3>
            <InputField label="SEO Title" name="seoTitle" register={register} errors={errors} />
            <TextAreaField label="SEO Description" name="seoDescription" register={register} errors={errors} rows={2} />
          </div>

          <div className="card-base p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800">FAQs</h3>
            <FAQField control={control} errors={errors} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-base p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Settings</h3>
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
            <InputField label="Category" name="category" register={register} errors={errors} placeholder="e.g. Property Insight" />
            <InputField label="Schema Type" name="schemaType" register={register} errors={errors} placeholder="Article" />
          </div>

          <div className="card-base p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Media</h3>
            <ImageField label="Featured Image" name="featuredImage" register={register} errors={errors} control={control} />
          </div>

          <div className="card-base p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Taxonomy</h3>
            <ArrayInputField
              label="Keywords"
              name="keywords"
              register={register}
              errors={errors}
              control={control}
              placeholder="indore property, budget homes"
            />
            <ArrayInputField
              label="Related Post Slugs"
              name="relatedSlugs"
              register={register}
              errors={errors}
              control={control}
              placeholder="slug-1, slug-2"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
