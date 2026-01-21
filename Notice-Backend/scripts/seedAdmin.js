import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import AdminUser from "../models/AdminUser.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const exists = await AdminUser.findOne({ email: "main@formida.app" });

if (exists) {
  console.log("Admin already exists");
  process.exit(0);
}

const passwordHash = await bcrypt.hash("Formida2025/2026", 12);

await AdminUser.create({
  name: "Main Admin",
  email: "main@formida.app",
  passwordHash,
  roles: ["super_admin"],
  isActive: true,
});

console.log("✅ Admin seeded successfully");
process.exit(0);
