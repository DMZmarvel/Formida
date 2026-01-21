import { Router } from "express";
import { adminAuth, requireRoles } from "../middleware/adminAuth.js";
import Notice from "../models/Notice.js";
import Vendor from "../models/Vendor.js";

const r = Router();

// GET /api/vendor/earnings  (vendor_admin only)
r.get(
  "/earnings",
  adminAuth,
  requireRoles("vendor_admin"),
  async (req, res) => {
    try {
      const vendorId = req.admin.vendorId;

      if (!vendorId) {
        return res.status(400).json({ message: "Vendor not found" });
      }

      const vendor = await Vendor.findById(vendorId);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor does not exist" });
      }

      // Fetch only paid notices under the vendor
      const notices = await Notice.find({
        vendorId,
        paid: true,
      });

      const totalRevenue = notices.reduce((sum, n) => sum + (n.price || 0), 0);

      const commissionPercent = vendor.commissionPct || 0;

      const commissionEarned = (totalRevenue * commissionPercent) / 100;

      res.json({
        vendor: vendor.name,
        totalNotices: notices.length,
        totalRevenue,
        commissionPercent,
        commissionEarned,
        notices,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch vendor earnings" });
    }
  }
);

export default r;
