// server.js (top)
const express = require("express");
const cors = require("cors");

let helmet, morgan, rateLimit;
try {
  helmet = require("helmet");
} catch {}
try {
  morgan = require("morgan");
} catch {}
try {
  rateLimit = require("express-rate-limit");
} catch {}

const connectDB = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();

connectDB();

const app = express();

// Use libs only if present
if (helmet) app.use(helmet());
if (morgan) app.use(morgan("tiny"));
if (rateLimit)
  app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use(express.json({ limit: "200kb" }));

// CORS (allow all if CORS_ORIGINS is not set)
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

// Health
app.get("/health", (req, res) =>
  res.json({ ok: true, uptime: process.uptime() })
);

// Routes
app.use("/api/auth", require("./routes/userRoutes"));
app.use("/api/notices", require("./routes/noticeRoutes"));
app.use("/api/stats", require("./routes/stats"));

const PORT = process.env.PORT || 4040;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
