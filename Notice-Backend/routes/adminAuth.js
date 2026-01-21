import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.js";
import { adminAuth, requireRoles } from "../middleware/adminAuth.js";

const r = Router();

/* ============================================================
   ADMIN LOGIN
============================================================ */
r.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  const user = await AdminUser.findOne({ email, isActive: true });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { sub: user.id, roles: user.roles, vendorId: user.vendorId ?? null },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({
    token,
    admin: {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      vendorId: user.vendorId,
    },
  });
});

/* ============================================================
   CREATE ADMIN USER (SUPER ADMIN ONLY)
============================================================ */
r.post("/create", adminAuth, requireRoles("super_admin"), async (req, res) => {
  const { name, email, password, roles, vendorId } = req.body || {};

  const exists = await AdminUser.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 12);

  const doc = await AdminUser.create({
    name,
    email,
    passwordHash,
    roles: roles?.length ? roles : ["moderator"],
    vendorId: vendorId ?? null,
  });

  return res.json({
    admin: {
      id: doc.id,
      name: doc.name,
      email: doc.email,
      roles: doc.roles,
      vendorId: doc.vendorId,
    },
  });
});

/* ============================================================
   GET CURRENT ADMIN INFO
============================================================ */
r.get("/me", adminAuth, (req, res) => {
  return res.json({ admin: req.admin });
});

export default r;
