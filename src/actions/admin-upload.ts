"use server";

import { v2 as cloudinary } from "cloudinary";
import { getAdminSession } from "@/lib/auth-guard";

export async function uploadImageAdmin(formData: FormData) {
  const s = await getAdminSession();
  if (!s?.user?.email || s.user.role !== "admin") {
    return { ok: false as const, error: "Unauthorized" };
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return { ok: false as const, error: "Cloudinary is not configured. Set CLOUDINARY_* env vars or paste image URLs manually." };
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return { ok: false as const, error: "No file provided" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${(file as File).type};base64,${buffer.toString("base64")}`;

  try {
    const res = await cloudinary.uploader.upload(base64, {
      folder: "indore-property-budget-finder",
      resource_type: "image"
    });
    return { ok: true as const, url: res.secure_url };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}
