import { Router } from "express";

const router = Router();

// Data Pricing Engine: estimated value per category (USD-like units; frontend can convert to tokens)
const BASE_PRICES = {
  HEALTH: 8,
  SHOPPING: 5,
  FITNESS: 4,
  LOCATION: 2,
  SOCIAL: 3,
};

router.get("/estimate", (req, res) => {
  const { category, reputationMultiplier = 1 } = req.query;
  const base = BASE_PRICES[category?.toUpperCase()] ?? 5;
  const estimated = Math.round(base * Number(reputationMultiplier) * 100) / 100;
  res.json({ category: category || "default", estimatedPriceUsd: estimated, basePriceUsd: base });
});

router.get("/all", (_, res) => {
  res.json(BASE_PRICES);
});

export { router as pricingRouter };
