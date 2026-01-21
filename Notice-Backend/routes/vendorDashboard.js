import { Router } from "express";
import { adminAuth, requireRoles } from "../middleware/adminAuth.js";
import Notice from "../models/Notice.js";
import Vendor from "../models/Vendor.js";

const r = Router();

r.get(
  "/dashboard",
  adminAuth,
  requireRoles("vendor_admin"),
  async (req, res) => {
    try {
      const vendorId = req.admin.vendorId;

      // Vendor data
      const vendor = await Vendor.findById(vendorId);

      const notices = await Notice.find({ vendorId })
        .sort({ createdAt: -1 })
        .limit(50);

      const totalNotices = notices.length;
      const paidNotices = notices.filter((n) => n.paid).length;
      const totalRevenue = notices.reduce((sum, n) => sum + (n.price || 0), 0);

      const commission = ((vendor.commissionPct || 0) / 100) * totalRevenue;

      res.json({
        vendor: vendor.name,
        totalNotices,
        paidNotices,
        totalRevenue,
        commissionEarned: commission,
        recent: notices.slice(0, 5),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to load dashboard" });
    }
  }
);

export default r;
