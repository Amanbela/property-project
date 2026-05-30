export type Purpose = "investment" | "family-living" | "rental-income";
export type Lifestyle =
  | "luxury"
  | "affordable"
  | "family-friendly"
  | "high-growth"
  | "premium";

export function getImageUrl(img: unknown): string {
  if (!img) return "";
  if (typeof img === "string") return img;
  if (typeof img === "object") {
    const v = img as Record<string, unknown>;
    return String(v.imageUrl ?? v.url ?? "");
  }
  return "";
}

export function extractImageUrls(imgs: unknown): string[] {
  if (!imgs) return [];
  if (!Array.isArray(imgs)) return [];
  return imgs.map((v) => getImageUrl(v)).filter(Boolean);
}

export interface Area {
  name: string;
  slug: string;
  description: string;
  averagePrice: number;
  investmentScore: number;
  familyScore: number;
  rentalDemand: number;
  futureGrowth: number;
  trafficCondition: number;
  nearbySchools: string[];
  nearbyHospitals: string[];
  nearbyMetro: boolean;
  coordinates: { lat: number; lng: number };
  featuredImage: string;
  gallery: string[];
  pros: string[];
  cons: string[];
  lifestyleTags: Lifestyle[];
  createdAt: string;
}

export interface Blog {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  createdAt: string;
}

export interface LeadInput {
  name: string;
  phone: string;
  budget: number;
  preferredArea: string;
  purpose: Purpose;
}
