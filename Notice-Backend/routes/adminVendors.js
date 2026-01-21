import { Router } from "express";
import Vendor from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import { adminAuth, requireRoles } from "../middleware/adminAuth.js";

const r = Router();

// LIST vendors
r.get(
  "/list",
  adminAuth,
  requireRoles("super_admin", "moderator"),
  async (req, res) => {
    const rows = await Vendor.find().sort({ createdAt: -1 });
    res.json({ data: rows });
  }
);

r.post("/", adminAuth, requireRoles("super_admin"), async (req, res) => {
  try {
    const { name, email, phone, commissionPct, password } = req.body;

    if (!password)
      return res.status(400).json({ message: "Password is required" });

    const exists = await Vendor.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Vendor email already exists" });

    const passwordHash = await bcrypt.hash(password, 12);

    const vendor = await Vendor.create({
      name,
      email,
      phone,
      commissionPct,
      passwordHash,
      pricingEnabled: true,
      totalNotices: 0,
      totalRevenue: 0,
    });

    res.json({ success: true, vendor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create vendor" });
  }
});

// UPDATE vendor
r.put("/:id", adminAuth, requireRoles("super_admin"), async (req, res) => {
  const { id } = req.params;
  const updated = await Vendor.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json({ vendor: updated });
});

// GET vendor details + stats + recent notices
r.get(
  "/details/:id",
  adminAuth,
  requireRoles("super_admin", "moderator"),
  async (req, res) => {
    try {
      const vendor = await Vendor.findById(req.params.id);
      if (!vendor) return res.status(404).json({ message: "Vendor not found" });

      const notices = await Notice.find({ vendorId: vendor._id }).sort({
        createdAt: -1,
      });

      const total = notices.length;
      const approved = notices.filter((n) => n.status === "approved").length;
      const pending = notices.filter((n) => n.status === "pending").length;
      const rejected = notices.filter((n) => n.status === "rejected").length;
      const revenue = notices.reduce((sum, n) => sum + (n.price || 0), 0);

      res.json({
        vendor,
        stats: { total, approved, pending, rejected, revenue },
        recent: notices.slice(0, 5),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch vendor details" });
    }
  }
);

// DELETE vendor
r.delete("/:id", adminAuth, requireRoles("super_admin"), async (req, res) => {
  const { id } = req.params;
  await Vendor.findByIdAndDelete(id);
  res.json({ message: "Vendor deleted" });
});

export default r;
