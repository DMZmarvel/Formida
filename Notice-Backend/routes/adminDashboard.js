import { Router } from "express";
import Notice from "../models/Notice.js";
import Vendor from "../models/Vendor.js";
import { adminAuth } from "../middleware/adminAuth.js";

const r = Router();

r.get("/", adminAuth, async (req, res) => {
  try {
    const totalNotices = await Notice.countDocuments();
    const pending = await Notice.countDocuments({ status: "pending" });
    const approved = await Notice.countDocuments({ status: "approved" });
    const rejected = await Notice.countDocuments({ status: "rejected" });

    const totalVendors = await Vendor.countDocuments();
    const pricingEnabled = await Vendor.countDocuments({
      pricingEnabled: true,
    });

    const revenue = await Notice.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const recentNotices = await Notice.find().sort({ createdAt: -1 }).limit(5);

    const recentVendors = await Vendor.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      notices: { totalNotices, pending, approved, rejected },
      vendors: { totalVendors, pricingEnabled },
      revenue: revenue[0]?.total || 0,
      recentNotices,
      recentVendors,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
});

export default r;
