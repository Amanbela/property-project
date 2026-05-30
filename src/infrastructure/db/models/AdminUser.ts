import mongoose, { Schema } from "mongoose";
const { model, models } = mongoose;

const adminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" }
  },
  { timestamps: true }
);

export const AdminUserModel = models.AdminUser || model("AdminUser", adminUserSchema);
