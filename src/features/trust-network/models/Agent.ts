import mongoose, { Schema, model, models } from "mongoose";

const AgentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    verifiedStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      index: true,
    },

    specializationAreas: [
      {
        type: String,
        trim: true,
      },
    ],

    /**
     * Colony references
     * Agent can work in multiple colonies
     */
    colonyCoverage: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Colony",
      },
    ],

    /**
     * Experience in years
     */
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    /**
     * Average rating
     */
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    /**
     * Average response time in minutes
     */
    responseTime: {
      type: Number,
      default: 0,
    },

    /**
     * Optional future fields
     */

    profileImage: {
      type: String,
      default: "",
    },

    companyName: {
      type: String,
      trim: true,
    },

    languages: [
      {
        type: String,
      },
    ],

    totalDealsClosed: {
      type: Number,
      default: 0,
    },

    activeStatus: {
      type: Boolean,
      default: true,
    },

    bio: {
      type: String,
      trim: true,
    },
    
    curationNotes: {
      type: String,
      trim: true,
    },

    verificationChecklist: {
      identityVerified: { type: Boolean, default: false },
      reraRegistered: { type: Boolean, default: false },
      experienceVerified: { type: Boolean, default: false },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * SEARCH INDEXES
 */

AgentSchema.index({
  name: "text",
  specializationAreas: "text",
});

AgentSchema.index({
  rating: -1,
});

AgentSchema.index({
  experience: -1,
});

export const Agent =
  models.Agent || model("Agent", AgentSchema);