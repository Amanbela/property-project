import mongoose, { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    userName: {
      type: String,
      trim: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const BuilderSchema = new Schema(
  {
    builderName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    /**
     * Total completed projects
     */
    completedProjects: {
      type: Number,
      default: 0,
      min: 0,
    },

    /**
     * Total ongoing projects
     */
    ongoingProjects: {
      type: Number,
      default: 0,
      min: 0,
    },

    /**
     * AI / Admin calculated score
     * Based on delivery, reviews, legal status etc.
     */
    reputationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
      index: true,
    },

    /**
     * RERA verification
     */
    reraVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    /**
     * User reviews
     */
    reviews: [ReviewSchema],

    /**
     * Optional future-ready fields
     */

    logo: {
      imageUrl: { type: String, default: "" },
      publicId: { type: String, default: "" }
    },

    foundedYear: {
      type: Number,
    },

    headquarters: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
    },

    contactNumber: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    specialization: [
      {
        type: String,
      },
    ],

    awards: [
      {
        type: String,
      },
    ],

    activeStatus: {
      type: Boolean,
      default: true,
    },

    curationNotes: {
      type: String,
      trim: true,
    },

    verificationChecklist: {
      identityVerified: { type: Boolean, default: false },
      trackRecordVerified: { type: Boolean, default: false },
      legalCompliant: { type: Boolean, default: false },
    },

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
 * TEXT SEARCH
 */

BuilderSchema.index({
  builderName: "text",
  description: "text",
});

/**
 * PERFORMANCE INDEXES
 */

BuilderSchema.index({
  reputationScore: -1,
});

export const Builder = models.Builder || model("Builder", BuilderSchema);
