"use client";

import React, { useState } from "react";
import { uploadImageAdmin } from "@/actions/admin-upload";
import { Image, Upload, X, Loader2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUrlFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ImageUrlField({ label, value, onChange, error }: ImageUrlFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showInput, setShowInput] = useState(!value);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadImageAdmin(formData);
      if (res.ok) {
        onChange(res.url);
        setShowInput(false);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(res.error || "Upload failed");
      }
    } catch (err) {
      toast.error("An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{label}</label>
      
      {value && !showInput ? (
        <div className="relative group aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setShowInput(true)}
              className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-900 dark:text-slate-100 hover:scale-110 transition-transform"
              title="Edit URL"
            >
              <LinkIcon size={18} />
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-2 bg-white dark:bg-slate-800 rounded-full text-red-600 dark:text-red-400 hover:scale-110 transition-transform"
              title="Remove"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste image URL or upload below..."
              className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-slate-100 ${
                error ? "border-red-500" : "border-slate-200 dark:border-slate-700"
              }`}
            />
          </div>
          
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-brand-600" size={24} />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Uploading to Cloudinary...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-slate-400 dark:text-slate-500 group-hover:text-brand-600 transition-colors">
                  <Upload size={20} />
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Click to upload image</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isUploading} />
          </label>
        </div>
      )}
      
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
