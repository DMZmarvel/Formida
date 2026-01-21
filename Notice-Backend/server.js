import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

let helmet = null;
let morgan = null;
let rateLimit = null;

// Try to import optional ESM modules
try {
  const mod = await import("helmet");
  helmet = mod.default;
} catch {}

try {
  const mod = await import("morgan");
  morgan = mod.default;
} catch {}

try {
  const mod = await import("express-rate-limit");
  rateLimit = mod.default;
} catch {}

// DB connection
import connectDB from "./config/db.js";
await connectDB();

const app = express();

// Optional middlewares
if (helmet) app.use(helmet());
if (morgan) app.use(morgan("tiny"));
if (rateLimit)
  app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use(express.json({ limit: "200kb" }));

// CORS
const allowed = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowed.length === 0 || allowed.includes(origin))
        return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Health check
app.get("/health", (req, res) =>
  res.json({ ok: true, uptime: process.uptime() })
);

// Routes — NOW using ESM imports
import userRoutes from "./routes/userRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import statsRoutes from "./routes/stats.js";
import adminAuthRoutes from "./routes/adminAuth.js";
import adminNoticesRoutes from "./routes/adminNotices.js";
import adminPricingRoutes from "./routes/adminPricing.js";
import vendorRoutes from "./routes/adminVendors.js";
import adminUsersRoutes from "./routes/adminUsers.js";
import vendorAuthRoutes from "./routes/vendorAuth.js";
import vendorNoticesRoutes from "./routes/vendorNotices.js";
import vendorEarningsRoutes from "./routes/vendorEarnings.js";
import vendorDashboardRoutes from "./routes/vendorDashboard.js";
import adminDashboardRoutes from "./routes/adminDashboard.js";
import publicPricingRoutes from "./routes/publicPricing.js";

// PUBLIC VENDOR LOGIN — MUST COME FIRST
app.use("/api/vendor", vendorAuthRoutes);

// Vendor protected routes
app.use("/api/vendor", vendorDashboardRoutes);
app.use("/api/vendor", vendorEarningsRoutes);
app.use("/api/vendor", vendorNoticesRoutes);

// Admin vendor management
app.use("/api/admin/vendors", vendorRoutes);

// Admin routes
app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin/notices", adminNoticesRoutes);
app.use("/api/admin/pricing", adminPricingRoutes);
app.use("/api/pricing", publicPricingRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

// Client routes
app.use("/api/auth", userRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/stats", statsRoutes);

const PORT = process.env.PORT || 4040;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
