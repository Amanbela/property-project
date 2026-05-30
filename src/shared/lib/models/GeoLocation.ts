import mongoose, { Schema, model, models } from "mongoose";

const GeoLocationSchema = new Schema(
  {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const NearbyPlaceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    distanceKm: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const ImageSchema = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      default: "",
    },
    alt: String,
  },
  { _id: false },
);

const ColonySchema = new Schema(
  {
    colonyName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    areaName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    builderName: {
      type: String,
      trim: true,
    },

    averagePlotPrice: {
      type: Number,
      default: 0,
    },

    averageFlatPrice: {
      type: Number,
      default: 0,
    },

    possessionStatus: {
      type: String,
      enum: ["ready-to-move", "under-construction", "new-launch", "resale"],
      default: "ready-to-move",
    },

    amenities: [
      {
        type: String,
        trim: true,
      },
    ],

    nearbySchools: [NearbyPlaceSchema],

    nearbyHospitals: [NearbyPlaceSchema],

    futureGrowthScore: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },

    investmentScore: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },

    familyScore: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },

    rentalDemand: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    trafficCondition: {
      type: String,
      enum: ["low", "moderate", "high"],
      default: "moderate",
    },

    legalApprovalStatus: {
      type: String,
      enum: ["approved", "pending", "disputed"],
      default: "approved",
    },

    reraStatus: {
      type: Boolean,
      default: false,
    },

    pros: [
      {
        type: String,
      },
    ],

    cons: [
      {
        type: String,
      },
    ],

    description: {
      type: String,
      trim: true,
    },

    geoLocation: {
      type: GeoLocationSchema,
      required: true,
    },

    images: [ImageSchema],

    isActive: {
      type: Boolean,
      default: true,
    },

    seoTitle: String,

    seoDescription: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

/**
 * GEO INDEX
 * For nearby colony search
 */
ColonySchema.index({
  "geoLocation.latitude": 1,
  "geoLocation.longitude": 1,
});

/**
 * TEXT SEARCH
 */
ColonySchema.index({
  colonyName: "text",
  areaName: "text",
  description: "text",
});

export const Colony = models.Colony || model("Colony", ColonySchema);
