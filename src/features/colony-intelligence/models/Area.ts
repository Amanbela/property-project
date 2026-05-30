// models/area-model.ts

import mongoose, { Schema } from "mongoose";

const { model, models } = mongoose;

const AreaSchema = new Schema(
  {
    // Basic
    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true
    },

    description: {
      type: String,
      default: ""
    },

    // Pricing
    averagePricePerSqft: {
      type: Number,
      default: 0
    },

    budgetCategory: [
      {
        type: String,
        enum: ["budget", "mid-range", "premium", "luxury"]
      }
    ],

    // Recommendation Scores
    investmentScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    familyScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    rentalDemand: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    futureGrowth: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    trafficScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    recommendationPriority: {
      type: Number,
      default: 0
    },

    // Property Support
    propertyTypes: [
      {
        type: String,
        enum: ["plot", "flat", "villa", "commercial"]
      }
    ],

    // Tags for AI Recommendation
    tags: [String],

    lifestyleTags: [String],

    // Connectivity
    connectivity: {
      metroDistanceKm: {
        type: Number,
        default: 0
      },

      airportDistanceKm: {
        type: Number,
        default: 0
      },

      railwayDistanceKm: {
        type: Number,
        default: 0
      }
    },

    // Nearby Places
    nearbySchools: [String],

    nearbyHospitals: [String],

    nearbyMalls: [String],

    nearbyITHubs: [String],

    // Colony Suggestions
    suggestedColonies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Colony"
      }
    ],

    // Location
    coordinates: {
      lat: Number,
      lng: Number
    },

    // Media
    featuredImage: {
      imageUrl: { type: String, default: "" },
      publicId: { type: String, default: "" }
    },

    gallery: [{
      imageUrl: { type: String, default: "" },
      publicId: { type: String, default: "" }
    }],

    // Content
    pros: [String],

    cons: [String],

    // SEO
    seoTitle: String,

    seoDescription: String,

    // Status
    published: {
      type: Boolean,
      default: true,
      index: true
    },

    featured: {
      type: Boolean,
      default: false
    },

    viewCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes
AreaSchema.index({
  published: 1,
  featured: 1
});

AreaSchema.index({
  name: "text",
  description: "text",
  tags: "text"
});

AreaSchema.index({
  investmentScore: -1,
  futureGrowth: -1
});

export const AreaModel =
  models.Area || model("Area", AreaSchema);