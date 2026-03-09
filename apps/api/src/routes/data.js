import { Router } from "express";
import { storeEncrypted, getByCid } from "../services/storage.js";
import { anonymize } from "../services/anonymize.js";

const router = Router();

router.post("/upload", async (req, res) => {
  try {
    const { walletAddress, category, payload } = req.body;
    if (!walletAddress || !category || !payload) {
      return res.status(400).json({ error: "walletAddress, category, payload required" });
    }
    const anonymized = await anonymize(category, payload);
    const cid = await storeEncrypted(walletAddress, category, anonymized);
    res.json({ cid, category });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/vault/:address", async (req, res) => {
  try {
    const list = await getByCid.listByOwner(req.params.address);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export { router as dataRouter };
