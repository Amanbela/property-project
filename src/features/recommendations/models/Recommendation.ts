import mongoose, { Schema } from "mongoose";
const { model, models } = mongoose;

const RecommendationSchema = new Schema(
  {
    userId: { type: String, index: true }, // Optional logged-in user
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", index: true }, // Reference to Lead if they submitted the form
    
    // Inputs
    budgetMin: { type: Number, required: true },
    budgetMax: { type: Number, required: true },
    propertyType: { type: String, required: true },
    purpose: { type: String, required: true },
    
    // Results
    suggestedColonies: [{ type: Schema.Types.ObjectId, ref: "Colony" }],
    matchScores: [
      {
        colonyId: { type: Schema.Types.ObjectId, ref: "Colony" },
        totalScore: Number,
        matchReasons: [String]
      }
    ]
  },
  { timestamps: true }
);

// Indexes
RecommendationSchema.index({ createdAt: -1 });

export const RecommendationModel = models.Recommendation || model("Recommendation", RecommendationSchema);
