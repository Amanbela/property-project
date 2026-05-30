import { v2 as cloudinary } from "cloudinary";
import { isAllowedImageType, isAllowedImageSize, type CloudinaryImage } from "./image-types";

function configure() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

const FOLDER = "indore-property-budget-finder";

export async function uploadImage(file: File): Promise<CloudinaryImage> {
  if (!isAllowedImageType(file.type)) {
    throw new Error("Invalid file type. Only JPG, PNG, and WEBP are allowed.");
  }
  if (!isAllowedImageSize(file.size)) {
    throw new Error("File too large. Maximum size is 5MB.");
  }

  configure();

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64, {
    folder: FOLDER,
    resource_type: "image",
  });

  return {
    imageUrl: result.secure_url,
    publicId: result.public_id,
  };
}

export async function uploadMultipleImages(files: File[]): Promise<CloudinaryImage[]> {
  const results: CloudinaryImage[] = [];
  for (const file of files) {
    const result = await uploadImage(file);
    results.push(result);
  }
  return results;
}

export async function deleteImage(publicId: string): Promise<void> {
  if (!publicId) return;
  configure();
  await cloudinary.uploader.destroy(publicId);
}

export async function deleteMultipleImages(publicIds: string[]): Promise<void> {
  const ids = publicIds.filter(Boolean);
  if (ids.length === 0) return;
  configure();
  await Promise.all(ids.map((id) => cloudinary.uploader.destroy(id)));
}

export async function deleteImageByUrl(url: string): Promise<void> {
  if (!url) return;
  const publicId = extractPublicId(url);
  if (publicId) {
    await deleteImage(publicId);
  }
}

function extractPublicId(url: string): string | null {
  if (!url) return null;
  const parts = url.split("/");
  const folderIndex = parts.indexOf(FOLDER);
  if (folderIndex === -1) return null;
  const filePart = parts.slice(folderIndex).join("/");
  return filePart.replace(/\.[^/.]+$/, "");
}

export async function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return { cloudName, apiKey, apiSecret };
}
