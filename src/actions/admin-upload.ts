"use server";

import { uploadImage } from "@/lib/cloudinary";
import { getAdminSession } from "@/lib/auth-guard";

export async function uploadImageAdmin(formData: FormData) {
  const s = await getAdminSession();
  if (!s?.user?.email || s.user.role !== "admin") {
    return { ok: false as const, error: "Unauthorized" };
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return { ok: false as const, error: "No file provided" };
  }

  try {
    const result = await uploadImage(file);
    return {
      ok: true as const,
      imageUrl: result.imageUrl,
      publicId: result.publicId,
    };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export async function uploadMultipleImagesAdmin(formData: FormData) {
  const s = await getAdminSession();
  if (!s?.user?.email || s.user.role !== "admin") {
    return { ok: false as const, error: "Unauthorized" };
  }

  const files = formData.getAll("files") as File[];
  if (!files.length) {
    return { ok: false as const, error: "No files provided" };
  }

  try {
    const { uploadMultipleImages } = await import("@/lib/cloudinary");
    const results = await uploadMultipleImages(files);
    return { ok: true as const, images: results };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}
