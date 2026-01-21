// routes/publicPricing.js
import { Router } from "express";
import PriceRule from "../models/PriceRule.js";

const r = Router();

// GET /api/pricing
// Public endpoint: returns ACTIVE global price rules (vendorId = null)
r.get("/", async (req, res) => {
  try {
    const rules = await PriceRule.find({
      isActive: true,
      vendorId: null,
    })
      .select("type newspaper amount -_id")
      .sort({ type: 1, newspaper: 1 });

    res.json({ data: rules });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pricing" });
  }
});

export default r;
