import { Router } from "express";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// In production: bind DID to wallet signature; for hackathon we use wallet address as key
const didStore = new Map();

router.post("/create", (req, res) => {
  const { walletAddress } = req.body;
  if (!walletAddress) return res.status(400).json({ error: "walletAddress required" });

  const did = `did:pde:${walletAddress.toLowerCase()}`;
  const id = uuidv4();
  const doc = {
    id: did,
    verificationMethod: [
      {
        id: `${did}#key-1`,
        type: "EthereumAddress",
        controller: did,
        blockchainAccountId: `${walletAddress}@eip155:137`,
      },
    ],
    createdAt: new Date().toISOString(),
    internalId: id,
  };
  didStore.set(walletAddress.toLowerCase(), doc);
  res.json({ did, document: doc });
});

router.get("/:address", (req, res) => {
  const doc = didStore.get(req.params.address.toLowerCase());
  if (!doc) return res.status(404).json({ error: "DID not found" });
  res.json(doc);
});

export { router as didRouter };
