import { Router } from "express";
import { adminAuth, requireRoles } from "../middleware/adminAuth.js";
import Notice from "../models/Notice.js";

const r = Router();

// GET /api/admin/notices/all
r.get(
  "/all",
  adminAuth,
  requireRoles("super_admin", "moderator", "vendor_admin"),
  async (req, res) => {
    try {
      const { search = "", page = 1, limit = 20 } = req.query;

      const skip = (Number(page) - 1) * Number(limit);

      const query = {};

      // SEARCH support
      if (search) {
        query.$or = [
          { referenceId: new RegExp(search, "i") },
          { type: new RegExp(search, "i") },
          { content: new RegExp(search, "i") },
        ];
      }

      const total = await Notice.countDocuments(query);

      const rows = await Notice.find(query)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      res.json({ data: rows, total });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch notices" });
    }
  }
);

// APPROVE NOTICE
r.put(
  "/approve/:id",
  adminAuth,
  requireRoles("super_admin", "moderator"),
  async (req, res) => {
    try {
      const notice = await Notice.findByIdAndUpdate(
        req.params.id,
        { status: "approved" },
        { new: true }
      );
      res.json({ notice });
    } catch (err) {
      res.status(500).json({ message: "Failed to approve" });
    }
  }
);

// REJECT NOTICE
r.put(
  "/reject/:id",
  adminAuth,
  requireRoles("super_admin", "moderator"),
  async (req, res) => {
    try {
      const notice = await Notice.findByIdAndUpdate(
        req.params.id,
        { status: "rejected" },
        { new: true }
      );
      res.json({ notice });
    } catch (err) {
      res.status(500).json({ message: "Failed to reject" });
    }
  }
);

export default r;
