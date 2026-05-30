import mongoose, { Schema } from "mongoose";
const { model, models } = mongoose;

const eventPropertiesSchema = new Schema(
  {
    propertyId: String,
    colonyId: String,
    builderId: String,
    areaName: String,
    colonyName: String,
    pageUrl: String,
    referrer: String,
    phone: String,
    budget: Number,
    message: String,
  },
  { _id: false }
);

const leadEventSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        "page_view",
        "property_viewed",
        "colony_viewed",
        "whatsapp_clicked",
        "call_clicked",
        "contact_form_submitted",
        "favorite_added",
        "property_shared",
        "lead_generated",
        "recommendation_requested",
      ],
      index: true,
    },
    properties: {
      type: eventPropertiesSchema,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ip: {
      type: String,
      default: "",
    },
    userAgent: {
      type: String,
      default: "",
    },
    source: {
      type: String,
      default: "website",
      enum: ["website", "whatsapp", "referral", "organic", "direct"],
    },
  },
  {
    timestamps: true,
  }
);

leadEventSchema.index({ eventType: 1, timestamp: -1 });
leadEventSchema.index({ sessionId: 1, eventType: 1, timestamp: -1 });
leadEventSchema.index({ "properties.areaName": 1, timestamp: -1 });
leadEventSchema.index({ "properties.colonyId": 1, timestamp: -1 });
leadEventSchema.index({ timestamp: -1 });

export const LeadEventModel =
  models.LeadEvent || model("LeadEvent", leadEventSchema);
