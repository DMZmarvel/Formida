import { Schema, model, Types } from "mongoose";
import mongoose from "mongoose";

const AdminUserSchema = new Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true, index: true },

    passwordHash: { type: String, required: true },

    roles: {
      type: [String],
      enum: ["super_admin", "moderator", "vendor_admin"],
      default: ["moderator"],
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: false,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model("AdminUser", AdminUserSchema);
