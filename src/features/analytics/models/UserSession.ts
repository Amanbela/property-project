import mongoose, { Schema } from "mongoose";
const { model, models } = mongoose;

const userSessionSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    firstVisit: {
      type: Date,
      default: Date.now,
    },
    lastVisit: {
      type: Date,
      default: Date.now,
      index: true,
    },
    pageViews: {
      type: Number,
      default: 0,
    },
    ip: {
      type: String,
      default: "",
    },
    userAgent: {
      type: String,
      default: "",
    },
    referrer: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

userSessionSchema.index({ lastVisit: -1 });

export const UserSessionModel =
  models.UserSession || model("UserSession", userSessionSchema);
