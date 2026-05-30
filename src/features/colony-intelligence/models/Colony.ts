// models/colony-model.ts

import mongoose, { Schema } from "mongoose";

const { model, models } = mongoose;

const ColonySchema = new Schema(
  {
    // Basic
    colonyName: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    // Relation
    areaId: {
      type: Schema.Types.ObjectId,
      ref: "Area",
      required: true,
      index: true
    },

    // Pricing
    averagePlotPrice: {
      type: Number,
      default: 0
    },

    averageFlatPrice: {
      type: Number,
      default: 0
    },

    budgetCategory: [
      {
        type: String,
        enum: ["budget", "mid-range", "premium", "luxury"]
      }
    ],

    // Property Types
    propertyTypes: [
      {
        type: String,
        enum: ["plot", "flat", "villa", "commercial"]
      }
    ],

    // Builder Info
    builderName: String,

    possessionStatus: {
      type: String,
      enum: [
        "Ready to Move",
        "Under Construction",
        "New Launch",
        "Pre Launch"
      ],
      default: "Ready to Move"
    },

    // Amenities
    amenities: [String],

    // Recommendation Tags
    tags: [String],

    // Intelligence Scores
    futureGrowthScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

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

    // Traffic
    trafficCondition: {
      type: String,
      enum: ["Low", "Moderate", "High"],
      default: "Moderate"
    },

    // Nearby Places
    nearbySchools: [String],

    nearbyHospitals: [String],

    nearbyMarkets: [String],

    // Trust & Legal
    legalApprovalStatus: String,

    reraStatus: {
      type: Boolean,
      default: false
    },

    verificationChecklist: {
      legalApproved: {
        type: Boolean,
        default: false
      },

      reraApproved: {
        type: Boolean,
        default: false
      },

      possessionVerified: {
        type: Boolean,
        default: false
      }
    },

    // Recommendation Boost
    recommendationPriority: {
      type: Number,
      default: 0
    },

    // Content
    pros: [String],

    cons: [String],

    description: String,

    curationNotes: String,

    // Location
    geoLocation: {
      lat: Number,
      lng: Number
    },

    // Media
    images: [{
      imageUrl: { type: String, default: "" },
      publicId: { type: String, default: "" }
    }],

    // FAQs
    faqs: [
      {
        question: String,
        answer: String
      }
    ],

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
ColonySchema.index({
  areaId: 1,
  averagePlotPrice: 1
});

ColonySchema.index({
  investmentScore: -1,
  futureGrowthScore: -1
});

ColonySchema.index({
  colonyName: "text",
  description: "text",
  tags: "text"
});

export const ColonyModel =
  models.Colony || model("Colony", ColonySchema);