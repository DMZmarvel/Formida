import { Router } from "express";
import { adminAuth, requireRoles } from "../middleware/adminAuth.js";
import Notice from "../models/Notice.js";

const r = Router();

// VENDOR — SEE ONLY THEIR OWN NOTICES
r.get(
  "/my-notices",
  adminAuth,
  requireRoles("vendor_admin"),
  async (req, res) => {
    try {
      const vendorId = req.admin.vendorId;
      const { search = "", status = "", page = 1, limit = 20 } = req.query;

      if (!vendorId) {
        return res.status(400).json({ message: "Vendor ID missing" });
      }

      const skip = (page - 1) * limit;

      const query = { vendorId };

      if (search) {
        query.$or = [
          { referenceId: new RegExp(search, "i") },
          { type: new RegExp(search, "i") },
        ];
      }

      if (status) query.status = status;

      const total = await Notice.countDocuments(query);

      const rows = await Notice.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      res.json({ data: rows, total });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to load vendor notices" });
    }
  }
);

export default r;
