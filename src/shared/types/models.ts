import { z } from "zod";

// --- Shared Types ---
export const GeoLocationSchema = z.object({
  lat: z.number(),
  lng: z.number()
});

export const FAQSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1)
});

export const CloudinaryImageSchema = z.union([
  z.object({
    imageUrl: z.string().default(""),
    publicId: z.string().default("")
  }),
  z.string()
]).transform((val) => {
  if (typeof val === "string") {
    return { imageUrl: val, publicId: "" };
  }
  return val;
});

export type CloudinaryImage = z.infer<typeof CloudinaryImageSchema>;

export function toCloudinaryImage(value: unknown): CloudinaryImage {
  if (!value) return { imageUrl: "", publicId: "" };
  if (typeof value === "string") return { imageUrl: value, publicId: "" };
  if (typeof value === "object") {
    const v = value as Record<string, unknown>;
    return {
      imageUrl: String(v.imageUrl ?? v.url ?? ""),
      publicId: String(v.publicId ?? ""),
    };
  }
  return { imageUrl: "", publicId: "" };
}

// --- BudgetRange ---
export const BudgetRangeSchema = z.object({
  _id: z.string().optional(),
  label: z.string().min(1, "Label is required"),
  slug: z.string().min(1, "Slug is required"),
  minPrice: z.number(),
  maxPrice: z.number(),
  description: z.string().default(""),
  heroHeading: z.string().default(""),
  metaTitle: z.string().default(""),
  metaDescription: z.string().default(""),
  recommendedAreas: z.array(z.string()).default([]),
  whyThisBudget: z.string().default(""),
  tipForBuyers: z.string().default(""),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});
export type BudgetRange = z.infer<typeof BudgetRangeSchema>;

export function toCloudinaryImages(value: unknown): CloudinaryImage[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((v) => toCloudinaryImage(v));
  }
  return [];
}

export function extractImageUrl(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const v = value as Record<string, unknown>;
    return String(v.imageUrl ?? v.url ?? "");
  }
  return "";
}

// --- Area ---
export const BudgetCategoryEnum = z.enum(["budget", "mid-range", "premium", "luxury"]);
export const PropertyTypeEnum = z.enum(["plot", "flat", "villa", "commercial"]);

export const AreaSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string(),
  description: z.string().optional(),

  // Pricing
  averagePrice: z.number().default(0),
  averagePricePerSqft: z.number().default(0),
  budgetCategory: z.array(BudgetCategoryEnum).default([]),

  // Property
  propertyTypes: z.array(PropertyTypeEnum).default([]),

  // Recommendation Scores (0-100)
  investmentScore: z.number().min(0).max(100).default(0),
  familyScore: z.number().min(0).max(100).default(0),
  rentalDemand: z.number().min(0).max(100).default(0),
  futureGrowth: z.number().min(0).max(100).default(0),
  trafficScore: z.number().min(0).max(100).default(0),
  trafficCondition: z.number().default(0),

  // Tags
  tags: z.array(z.string()).default([]),
  lifestyleTags: z.array(z.string()).default([]),

  // Connectivity
  connectivity: z.object({
    metroDistanceKm: z.number().default(0),
    airportDistanceKm: z.number().default(0),
    railwayDistanceKm: z.number().default(0),
  }).optional(),

  // Nearby Facilities
  nearbySchools: z.array(z.string()).default([]),
  nearbyHospitals: z.array(z.string()).default([]),
  nearbyMalls: z.array(z.string()).default([]),
  nearbyITHubs: z.array(z.string()).default([]),
  nearbyMetro: z.boolean().default(false),

  // Location
  coordinates: GeoLocationSchema.optional(),

  // Media
  featuredImage: CloudinaryImageSchema.optional().default({ imageUrl: "", publicId: "" }),
  gallery: z.array(CloudinaryImageSchema).default([]),

  // Content
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),

  // Colony Suggestions
  suggestedColonies: z.array(z.string()).default([]),

  // SEO
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),

  // Status
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
  viewCount: z.number().default(0),

  // Timestamps
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});
export type Area = z.infer<typeof AreaSchema>;

// --- Colony ---
export const ColonySchema = z.object({
  _id: z.string().optional(),
  colonyName: z.string().min(1, "Colony name is required"),
  slug: z.string(),
  areaName: z.string(),
  averagePlotPrice: z.number().default(0),
  averageFlatPrice: z.number().default(0),
  builderName: z.string().optional(),
  possessionStatus: z.enum(["Ready to Move", "Under Construction", "New Launch", "Pre Launch"]).default("Ready to Move"),
  amenities: z.array(z.string()).default([]),
  nearbySchools: z.array(z.string()).default([]),
  nearbyHospitals: z.array(z.string()).default([]),
  futureGrowthScore: z.number().min(0).max(100).default(0),
  investmentScore: z.number().min(0).max(100).default(0),
  familyScore: z.number().min(0).max(100).default(0),
  rentalDemand: z.number().min(0).max(100).default(0),
  trafficCondition: z.enum(["Low", "Moderate", "High"]).default("Moderate"),
  legalApprovalStatus: z.string().optional(),
  reraStatus: z.boolean().default(false),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  description: z.string().optional(),
  geoLocation: GeoLocationSchema.optional(),
  images: z.array(CloudinaryImageSchema).default([]),
  faqs: z.array(FAQSchema).default([]),
  curationNotes: z.string().optional(),
  verificationChecklist: z.object({
    legalApproved: z.boolean().default(false),
    reraApproved: z.boolean().default(false),
    possessionVerified: z.boolean().default(false),
  }).default({}),
  published: z.boolean().default(true),
  viewCount: z.number().default(0),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});
export type Colony = z.infer<typeof ColonySchema>;

// --- Builder ---
export const BuilderSchema = z.object({
  _id: z.string().optional(),
  builderName: z.string().min(1, "Builder name is required"),
  completedProjects: z.number().default(0),
  ongoingProjects: z.number().default(0),
  reputationScore: z.number().min(0).max(10).default(0),
  reraVerified: z.boolean().default(false),
  reviews: z.array(z.object({
    userName: z.string().optional(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
  })).default([]),
  logo: CloudinaryImageSchema.optional().default({ imageUrl: "", publicId: "" }),
  description: z.string().optional(),
  contactNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  activeStatus: z.boolean().default(true),
  curationNotes: z.string().optional(),
  verificationChecklist: z.object({
    identityVerified: z.boolean().default(false),
    trackRecordVerified: z.boolean().default(false),
    legalCompliant: z.boolean().default(false),
  }).default({}),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});
export type Builder = z.infer<typeof BuilderSchema>;

// --- Agent ---
export const AgentSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1),
  phone: z.string().min(10),
  verifiedStatus: z.enum(["pending", "verified", "rejected"]).default("pending"),
  specializationAreas: z.array(z.string()).default([]),
  colonyCoverage: z.array(z.string()).default([]), // Array of ObjectId strings
  experience: z.number().default(0),
  rating: z.number().min(0).max(5).default(0),
  responseTime: z.number().default(0), // in minutes
  profileImage: CloudinaryImageSchema.optional().default({ imageUrl: "", publicId: "" }),
  companyName: z.string().optional(),
  totalDealsClosed: z.number().default(0),
  activeStatus: z.boolean().default(true),
  bio: z.string().optional(),
  curationNotes: z.string().optional(),
  verificationChecklist: z.object({
    identityVerified: z.boolean().default(false),
    reraRegistered: z.boolean().default(false),
    experienceVerified: z.boolean().default(false),
  }).default({}),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});
export type Agent = z.infer<typeof AgentSchema>;

// --- Lead ---
export const LeadSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1),
  phone: z.string().min(10),
  budget: z.number().optional(),
  preferredArea: z.string().optional(),
  interestedColony: z.string().optional(),
  propertyType: z.string().optional(),
  purchasePurpose: z.string().optional(),
  purpose: z.string().optional(),
  source: z.string().default("website"),
  status: z.enum(["new", "contacted", "interested", "closed"]).default("new"),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});
export type Lead = z.infer<typeof LeadSchema>;

// --- Blog ---
export const BlogSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  content: z.string().default(""),
  featuredImage: CloudinaryImageSchema.optional().default({ imageUrl: "", publicId: "" }),
  category: z.string().default("Property Insight"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  keywords: z.array(z.string()).default([]),
  schemaType: z.string().default("Article"),
  status: z.enum(["draft", "published"]).default("draft"),
  relatedSlugs: z.array(z.string()).default([]),
  faqs: z.array(FAQSchema).default([]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});
export type Blog = z.infer<typeof BlogSchema>;

// --- Recommendation ---
export const RecommendationSchema = z.object({
  _id: z.string().optional(),
  userId: z.string().optional(),
  leadId: z.string().optional(), // Ref to Lead
  budgetMin: z.number(),
  budgetMax: z.number(),
  propertyType: z.string(),
  purpose: z.string(),
  suggestedColonies: z.array(z.string()), // Refs to Colonies
  matchScores: z.array(z.object({
    colonyId: z.string(),
    totalScore: z.number(),
    matchReasons: z.array(z.string())
  })),
  createdAt: z.date().optional()
});
export type RecommendationSession = z.infer<typeof RecommendationSchema>;
