import mongoose, { Schema } from "mongoose";

const { model, models } = mongoose;

const BudgetRangeSchema = new Schema(
  {
    label: {
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

    minPrice: {
      type: Number,
      required: true
    },

    maxPrice: {
      type: Number,
      required: true
    },

    description: {
      type: String,
      default: ""
    },

    heroHeading: {
      type: String,
      default: ""
    },

    metaTitle: {
      type: String,
      default: ""
    },

    metaDescription: {
      type: String,
      default: ""
    },

    recommendedAreas: [
      {
        type: Schema.Types.ObjectId,
        ref: "Area"
      }
    ],

    whyThisBudget: {
      type: String,
      default: ""
    },

    tipForBuyers: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    sortOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

BudgetRangeSchema.index({ sortOrder: 1 });
BudgetRangeSchema.index({ isActive: 1, sortOrder: 1 });

export const BudgetRangeModel =
  models.BudgetRange || model("BudgetRange", BudgetRangeSchema);
