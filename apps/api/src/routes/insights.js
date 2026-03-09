import { Router } from "express";
import { getByCid } from "../services/storage.js";

const router = Router();

// Deliver anonymized insight (CID from smart contract fulfillment)
router.get("/:cid", async (req, res) => {
  const record = await getByCid(req.params.cid);
  if (!record) return res.status(404).json({ error: "Insight not found" });
  res.json(record.data);
});

export { router as insightsRouter };
