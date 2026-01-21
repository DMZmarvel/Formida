import { Router } from "express";
import bcrypt from "bcryptjs";
import AdminUser from "../models/AdminUser.js";
import Vendor from "../models/Vendor.js";
import { adminAuth, requireRoles } from "../middleware/adminAuth.js";

const r = Router();

// LIST ALL ADMINS — super_admin only
r.get("/", adminAuth, requireRoles("super_admin"), async (req, res) => {
  const admins = await AdminUser.find({})
    .populate("vendorId", "name")
    .sort({ createdAt: -1 });

  res.json({ data: admins });
});

// CREATE ADMIN USER
r.post("/", adminAuth, requireRoles("super_admin"), async (req, res) => {
  let { name, email, password, roles, vendorId } = req.body;

  // 🔥 FIX: Remove vendorId if empty
  if (!vendorId || vendorId === "") {
    vendorId = undefined;
  }

  const exists = await AdminUser.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await AdminUser.create({
    name,
    email,
    passwordHash,
    roles,
    vendorId, // this will be undefined when not supplied
  });

  res.json({ data: user });
});

// UPDATE ADMIN (roles or vendor)
r.put("/:id", adminAuth, requireRoles("super_admin"), async (req, res) => {
  const update = req.body;
  const admin = await AdminUser.findByIdAndUpdate(req.params.id, update, {
    new: true,
  });
  res.json({ admin });
});

// DEACTIVATE / ACTIVATE ADMIN
r.put(
  "/:id/toggle",
  adminAuth,
  requireRoles("super_admin"),
  async (req, res) => {
    const admin = await AdminUser.findById(req.params.id);
    admin.isActive = !admin.isActive;
    await admin.save();

    res.json({ admin });
  }
);

// RESET PASSWORD
r.put(
  "/:id/reset-password",
  adminAuth,
  requireRoles("super_admin"),
  async (req, res) => {
    const { password } = req.body;
    const hashed = await bcrypt.hash(password, 12);

    const admin = await AdminUser.findByIdAndUpdate(
      req.params.id,
      { passwordHash: hashed },
      { new: true }
    );

    res.json({ admin });
  }
);

export default r;
