"use client";

import { useState, useRef } from "react";
import { uploadImageAdmin } from "@/actions/admin-upload";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  value: string;
  onChange: (imageUrl: string, publicId: string) => void;
  label?: string;
  error?: string;
}

export function ImageUploader({ value, onChange, label = "Image", error }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPG, PNG, and WEBP files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 5MB");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadImageAdmin(formData);
      if (res.ok) {
        onChange(res.imageUrl, res.publicId);
        setPreview(res.imageUrl);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(res.error || "Upload failed");
        setPreview(value);
      }
    } catch {
      toast.error("An error occurred during upload");
      setPreview(value);
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(objectUrl);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    onChange("", "");
    setPreview("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          {label}
        </label>
      )}

      {preview ? (
        <div className="relative group aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={() => setPreview("")}
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-900 dark:text-slate-100 hover:scale-110 transition-transform"
              title="Replace image"
            >
              <Upload size={18} />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="p-2 bg-white dark:bg-slate-800 rounded-full text-red-600 dark:text-red-400 hover:scale-110 transition-transform"
              title="Remove image"
            >
              <X size={18} />
            </button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
              <Loader2 className="animate-spin text-white" size={32} />
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-brand-600" size={24} />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Uploading to Cloudinary...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-slate-400 dark:text-slate-500 group-hover:text-brand-600 transition-colors">
                <ImageIcon size={20} />
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Click or drag to upload
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                JPG, PNG, WEBP &middot; Max 5MB
              </span>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        disabled={isUploading}
      />

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
