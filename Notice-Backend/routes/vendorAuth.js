import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Vendor from "../models/Vendor.js";

const r = Router();

// POST /api/vendor/login
r.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const vendor = await Vendor.findOne({ email });
  if (!vendor) return res.status(400).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, vendor.passwordHash);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    {
      sub: vendor.id,
      type: "vendor",
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    vendor: { id: vendor.id, name: vendor.name, email: vendor.email },
  });
});

export default r;
