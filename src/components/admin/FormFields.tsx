"use client";

import React from "react";
import { UseFormRegister, FieldErrors, Control, Controller, useFieldArray } from "react-hook-form";
import { ImageUrlField } from "./ImageUrlField";
import { Plus, Trash2, ShieldCheck } from "lucide-react";
import { FieldValues } from "react-hook-form";

export const ImageField: React.FC<BaseFieldProps> = ({
  label,
  name,
  errors,
  control,
  className = "",
}) => (
  <div className={className}>
    {control && (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ImageUrlField
            label={label}
            value={field.value}
            onChange={field.onChange}
            error={errors[name]?.message as string}
          />
        )}
      />
    )}
  </div>
);

interface BaseFieldProps {
  label: string;
  name: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  required?: boolean;
  className?: string;
  placeholder?: string;
  control?: Control<FieldValues>;
}

export const InputField: React.FC<BaseFieldProps & { type?: string }> = ({
  label,
  name,
  register,
  errors,
  required,
  type = "text",
  className = "",
  placeholder,
}) => (
  <div className={`space-y-1.5 ${className}`}>
    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}{required && "*"}</label>
    <input
      type={type}
      placeholder={placeholder}
      {...register(name, { required })}
      className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-slate-100 ${
        errors[name] ? "border-red-500 bg-red-50 dark:bg-red-900/10" : "border-slate-200 dark:border-slate-700"
      }`}
    />
    {errors[name] && <p className="text-xs text-red-500 font-medium">{errors[name]?.message as string}</p>}
  </div>
);

export const TextAreaField: React.FC<BaseFieldProps & { rows?: number }> = ({
  label,
  name,
  register,
  errors,
  required,
  rows = 4,
  className = "",
  placeholder,
}) => (
  <div className={`space-y-1.5 ${className}`}>
    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}{required && "*"}</label>
    <textarea
      rows={rows}
      placeholder={placeholder}
      {...register(name, { required })}
      className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-slate-100 ${
        errors[name] ? "border-red-500 bg-red-50 dark:bg-red-900/10" : "border-slate-200 dark:border-slate-700"
      }`}
    />
    {errors[name] && <p className="text-xs text-red-500 font-medium">{errors[name]?.message as string}</p>}
  </div>
);

export const SelectField: React.FC<BaseFieldProps & { options: { label: string; value: string }[] }> = ({
  label,
  name,
  register,
  errors,
  required,
  options,
  className = "",
}) => (
  <div className={`space-y-1.5 ${className}`}>
    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}{required && "*"}</label>
    <select
      {...register(name, { required })}
      className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-slate-100 ${
        errors[name] ? "border-red-500 bg-red-50 dark:bg-red-900/10" : "border-slate-200 dark:border-slate-700"
      }`}
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {errors[name] && <p className="text-xs text-red-500 font-medium">{errors[name]?.message as string}</p>}
  </div>
);

export const CheckboxField: React.FC<BaseFieldProps> = ({
  label,
  name,
  register,
  className = "",
}) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <input
      type="checkbox"
      id={name}
      {...register(name)}
      className="w-5 h-5 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-brand-600 focus:ring-brand-500/20"
    />
    <label htmlFor={name} className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
      {label}
    </label>
  </div>
);

export const SeoFieldSet: React.FC<{ register: UseFormRegister<FieldValues>; errors: FieldErrors }> = ({
  register,
  errors,
}) => (
  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">SEO Management</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        label="Meta Title"
        name="seoTitle"
        register={register}
        errors={errors}
        placeholder="Enter SEO-friendly title"
      />
      <InputField
        label="Slug"
        name="slug"
        register={register}
        errors={errors}
        placeholder="auto-generated-if-empty"
      />
      <TextAreaField
        label="Meta Description"
        name="seoDescription"
        register={register}
        errors={errors}
        rows={2}
        className="md:col-span-2"
        placeholder="Enter SEO description for search engines"
      />
    </div>
  </div>
);

export const ArrayInputField: React.FC<BaseFieldProps> = ({
  label,
  name,
  register,
  errors,
  control,
  className = "",
  placeholder = "Enter items separated by commas",
}) => (
  <div className={`space-y-1.5 ${className}`}>
    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <input
          {...field}
          value={Array.isArray(field.value) ? field.value.join(", ") : field.value}
          onChange={(e) => {
            const val = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
            field.onChange(val);
          }}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-slate-100 ${
            errors[name] ? "border-red-500 bg-red-50 dark:bg-red-900/10" : "border-slate-200 dark:border-slate-700"
          }`}
        />
      )}
    />
    {errors[name] && <p className="text-xs text-red-500 font-medium">{errors[name]?.message as string}</p>}
  </div>
);

export const FAQField: React.FC<{ control: Control<FieldValues>; errors: FieldErrors }> = ({ control, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "faqs",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">FAQs</label>
        <button
          type="button"
          onClick={() => append({ question: "", answer: "" })}
          className="text-brand-600 hover:text-brand-700 flex items-center gap-1 text-xs font-bold"
        >
          <Plus size={14} /> Add FAQ
        </button>
      </div>
      
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="relative p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 group">
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={16} />
            </button>
            <div className="grid gap-3">
              <input
                {...control.register(`faqs.${index}.question` as const)}
                placeholder="Question"
                className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-sm font-semibold focus:outline-none focus:border-brand-500 dark:text-slate-100"
              />
              <textarea
                {...control.register(`faqs.${index}.answer` as const)}
                placeholder="Answer"
                rows={2}
                className="w-full bg-transparent border-none py-1 text-sm focus:outline-none resize-none dark:text-slate-300"
              />
            </div>
          </div>
        ))}
        {fields.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
            No FAQs added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export const ReviewField: React.FC<{ control: Control<FieldValues>; errors: FieldErrors }> = ({ control, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "reviews",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Customer Reviews</label>
        <button
          type="button"
          onClick={() => append({ userName: "", rating: 5, comment: "" })}
          className="text-brand-600 hover:text-brand-700 flex items-center gap-1 text-xs font-bold"
        >
          <Plus size={14} /> Add Review
        </button>
      </div>
      
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="relative p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 group">
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={16} />
            </button>
            <div className="grid gap-3">
              <div className="flex gap-4">
                <input
                  {...control.register(`reviews.${index}.userName` as const)}
                  placeholder="User Name"
                  className="flex-1 bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-sm font-semibold focus:outline-none focus:border-brand-500 dark:text-slate-100"
                />
                <input
                  type="number"
                  min={1}
                  max={5}
                  {...control.register(`reviews.${index}.rating` as const, { valueAsNumber: true })}
                  className="w-16 bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-sm font-semibold focus:outline-none focus:border-brand-500 dark:text-slate-100"
                />
              </div>
              <textarea
                {...control.register(`reviews.${index}.comment` as const)}
                placeholder="Comment"
                rows={2}
                className="w-full bg-transparent border-none py-1 text-sm focus:outline-none resize-none dark:text-slate-300"
              />
            </div>
          </div>
        ))}
        {fields.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
            No reviews added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export const CurationFieldSet: React.FC<{ 
  register: UseFormRegister<FieldValues>; 
  errors: FieldErrors; 
  checklist: { name: string; label: string }[];
}> = ({ register, errors, checklist }) => (
  <div className="p-6 space-y-6 border border-brand-100 bg-brand-50/30 dark:bg-brand-900/10 dark:border-brand-800 rounded-2xl">
    <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400">
      <ShieldCheck size={20} />
      <h3 className="text-lg font-bold">Manual Trust Curation</h3>
    </div>
    
    <div className="space-y-4">
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Verification Checklist</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {checklist.map((item) => (
          <label key={item.name} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
            <input
              type="checkbox"
              {...register(`verificationChecklist.${item.name}`)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
          </label>
        ))}
      </div>
    </div>

    <TextAreaField
      label="Internal Curation Notes (Manual Review)"
      name="curationNotes"
      register={register}
      errors={errors}
      rows={3}
      placeholder="Why is this agent/builder trusted? Note any manual verification steps taken..."
    />
  </div>
);
