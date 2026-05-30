"use client";

import { useState, useRef } from "react";
import { uploadMultipleImagesAdmin } from "@/actions/admin-upload";
import { Upload, X, Loader2, ImageIcon, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface CloudinaryImageRef {
  imageUrl: string;
  publicId: string;
}

interface MultiImageUploaderProps {
  values: CloudinaryImageRef[];
  onChange: (images: CloudinaryImageRef[]) => void;
  label?: string;
  maxFiles?: number;
  error?: string;
}

export function MultiImageUploader({
  values,
  onChange,
  label = "Gallery Images",
  maxFiles = 20,
  error,
}: MultiImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const remaining = maxFiles - values.length;

    if (fileArray.length > remaining) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }

    for (const file of fileArray) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error(`"${file.name}" is not a valid image type. Only JPG, PNG, WEBP allowed`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" is too large. Maximum size is 5MB`);
        return;
      }
    }

    setIsUploading(true);
    const formData = new FormData();
    fileArray.forEach((file) => formData.append("files", file));

    try {
      const res = await uploadMultipleImagesAdmin(formData);
      if (res.ok) {
        onChange([...values, ...res.images]);
        toast.success(`${res.images.length} image(s) uploaded`);
      } else {
        toast.error(res.error || "Upload failed");
      }
    } catch {
      toast.error("An error occurred during upload");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    const updated = values.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          {label} {values.length > 0 && <span className="text-slate-400">({values.length})</span>}
        </label>
      )}

      {/* Image Grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {values.map((img, index) => (
            <div
              key={`${img.publicId || img.imageUrl}-${index}`}
              className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950"
            >
              <img
                src={img.imageUrl}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-1.5 bg-white dark:bg-slate-800 rounded-full text-red-600 dark:text-red-400 hover:scale-110 transition-transform"
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="absolute top-1.5 left-1.5 bg-slate-900/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {values.length === 0 && !isUploading && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-slate-400 dark:text-slate-500 group-hover:text-brand-600 transition-colors">
              <ImageIcon size={20} />
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Click or drag images here
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              JPG, PNG, WEBP &middot; Max 5MB each &middot; Up to {maxFiles}
            </span>
          </div>
        </div>
      )}

      {values.length > 0 && values.length < maxFiles && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="flex items-center justify-center w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
        >
          {isUploading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin text-brand-600" size={18} />
              <span className="text-xs font-medium text-slate-500">Uploading...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 group-hover:text-brand-600 transition-colors">
              <Upload size={16} />
              <span className="text-xs font-medium">Add more images</span>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={isUploading}
      />

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
