import { Router } from "express";
import { adminAuth, requireRoles } from "../middleware/adminAuth.js";
import PriceRule from "../models/PriceRule.js";

const r = Router();

// GET all rules
r.get(
  "/",
  adminAuth,
  requireRoles("super_admin", "moderator", "vendor_admin"),
  async (req, res) => {
    const me = req.admin || {};

    let rules;

    if (
      me.vendorId &&
      !me.roles.includes("super_admin") &&
      !me.roles.includes("moderator")
    ) {
      rules = await PriceRule.find({
        $or: [{ vendorId: me.vendorId }, { vendorId: null }],
      }).sort({ vendorId: 1, type: 1 });
    } else {
      rules = await PriceRule.find({}).sort({ vendorId: 1, type: 1 });
    }

    res.json({ data: rules });
  }
);

// Create/update global rule
r.post(
  "/",
  adminAuth,
  requireRoles("super_admin", "moderator"),
  async (req, res) => {
    const { type, newspaper, amount } = req.body;

    const doc = await PriceRule.findOneAndUpdate(
      { type, newspaper, vendorId: null },
      { amount, isActive: true },
      { upsert: true, new: true }
    );

    res.json({ rule: doc });
  }
);

// Create vendor override rule
r.post(
  "/vendor",
  adminAuth,
  requireRoles("super_admin", "vendor_admin"),
  async (req, res) => {
    const { type, newspaper, amount, vendorId } = req.body;
    const me = req.admin || {};

    const vId = me.roles.includes("vendor_admin") ? me.vendorId : vendorId;
    if (!vId) return res.status(400).json({ message: "vendorId required" });

    const doc = await PriceRule.findOneAndUpdate(
      { type, newspaper, vendorId: vId },
      { amount, isActive: true },
      { upsert: true, new: true }
    );

    res.json({ rule: doc });
  }
);

export default r;
