import mongoose, { Schema } from "mongoose";
const { model, models } = mongoose;

const leadSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    budget: Number,
    preferredArea: String,
    interestedColony: String,
    propertyType: String,
    purchasePurpose: String,
    purpose: String,
    source: { type: String, default: "website" },
    status: {
      type: String,
      enum: ["new", "contacted", "interested", "closed"],
      default: "new",
      index: true
    },
    notes: String
  },
  { timestamps: true }
);

leadSchema.index({ createdAt: -1 });
leadSchema.index({ name: "text", phone: "text", preferredArea: "text" });

export const LeadModel = models.Lead || model("Lead", leadSchema);
