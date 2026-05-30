export interface CloudinaryImage {
  imageUrl: string;
  publicId: string;
}

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function isAllowedImageType(mime: string): boolean {
  return ALLOWED_IMAGE_TYPES.includes(mime);
}

export function isAllowedImageSize(bytes: number): boolean {
  return bytes <= MAX_IMAGE_SIZE;
}

export function toCloudinaryImage(
  value: string | CloudinaryImage | undefined | null
): CloudinaryImage | null {
  if (!value) return null;
  if (typeof value === "string") {
    if (!value) return null;
    return { imageUrl: value, publicId: "" };
  }
  return value;
}

export function toCloudinaryImages(
  values: (string | CloudinaryImage)[] | undefined | null
): CloudinaryImage[] {
  if (!values) return [];
  return values.map((v) => {
    if (typeof v === "string") return { imageUrl: v, publicId: "" };
    return v;
  });
}

export function extractUrl(
  value: string | CloudinaryImage | undefined | null
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.imageUrl ?? "";
}
