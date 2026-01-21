// models/PriceRule.ts
import { Schema, model } from "mongoose";

const PriceRuleSchema = new Schema(
  {
    type: { type: String, required: true },

    // newspaper no longer required for rules that don't need it
    newspaper: { type: String, default: null },

    amount: { type: Number, required: true },

    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", default: null },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Unique rule per (type + newspaper + vendor)
PriceRuleSchema.index({ type: 1, newspaper: 1, vendorId: 1 }, { unique: true });

export default model("PriceRule", PriceRuleSchema);
