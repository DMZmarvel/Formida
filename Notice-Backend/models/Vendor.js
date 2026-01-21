import { Schema, model } from "mongoose";

const VendorSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: String,

    passwordHash: { type: String, required: true },

    commissionPct: { type: Number, default: 10 },
    totalNotices: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },

    pricingEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// compare password helper
VendorSchema.methods.checkPassword = function (pwd) {
  return bcrypt.compare(pwd, this.passwordHash);
};

export default model("Vendor", VendorSchema);
