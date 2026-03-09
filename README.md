# Personal Data Economy Wallet

**Your data. Your asset. Your income.**

A Web3 wallet that stores, controls, and monetizes your personal data using blockchain + AI + privacy tech. Think UPI, but for your data—you decide who accesses it, for how long, and how much you get paid.

## What It Does

1. **Connect wallet** → Create DID (Decentralized Identity)
2. **Upload data** → Encrypt & store (IPFS-style); AI anonymizes
3. **Marketplace** → Companies request access; smart contract checks permissions
4. **Get paid** → Tokens/crypto to your wallet when insights are delivered

## Stack

| Layer      | Tech |
|-----------|------|
| Frontend  | Next.js 14, React, RainbowKit, wagmi, Tailwind |
| Backend   | Node.js, Express |
| Blockchain| Solidity (Hardhat), Polygon Amoy |
| Storage   | Mock IPFS (swap for Pinata/web3.storage) |
| Identity  | DID (did:pde:wallet) |

## Quick Start (Hackathon)

### 1. Install

```bash
npm install
```

### 2. Environment

Copy and fill (see below):

```bash
cp .env.example .env
```

- `NEXT_PUBLIC_API_URL` = backend URL (e.g. `http://localhost:4000`)
- `NEXT_PUBLIC_WALLETCONNECT_ID` = [WalletConnect Cloud](https://cloud.walletconnect.com) project ID (optional for demo)
- After deploying contracts: `NEXT_PUBLIC_DATA_TOKEN_ADDRESS`, `NEXT_PUBLIC_MARKETPLACE_ADDRESS`

### 3. Run API + Web

```bash
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:4000](http://localhost:4000)

### 4. Deploy Contracts (optional for full flow)

```bash
cd contracts
npm install
npx hardhat node   # terminal 1: local chain
npx hardhat run scripts/deploy.js --network localhost   # terminal 2
```

Copy the printed token and marketplace addresses into `.env` in the repo root (and in `apps/web` if you use a separate .env there).

## Project Structure

```
├── apps/
│   ├── web/          # Next.js app (wallet connect, vault, marketplace UI)
│   └── api/          # Express API (DID, data upload, anonymization, pricing)
├── contracts/        # Solidity (DataMarketplace, MockERC20)
├── package.json      # Workspace root
└── README.md
```

## Features

- **DID identity** – `POST /api/did/create` with `walletAddress`
- **Data vault** – Upload JSON by category; stored in mock IPFS; AI anonymization
- **Data pricing engine** – `GET /api/pricing/estimate?category=HEALTH` (e.g. Health $8, Fitness $4)
- **Smart contracts** – Permissions, requests, escrow, reputation score, withdraw earnings

## Use Cases

- **Healthcare** – Sell anonymous medical data for research; pharma pays, you earn
- **Marketing** – Brands pay for real insights (e.g. “users who run 10km weekly”) instead of raw ads
- **Smart cities** – Share mobility/traffic data; city planners pay for insights
- **AI training** – Sell voice, image, or behavior data to AI companies

## License

MIT
# PERSONAL-DATA-ECONOMY-WALLET
# PERSONAL-DATA-ECONOMY-WALLET
