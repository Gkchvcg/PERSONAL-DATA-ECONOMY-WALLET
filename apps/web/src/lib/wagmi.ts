import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygonAmoy } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Personal Data Economy Wallet",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || "demo-project-id",
  chains: [polygonAmoy],
  ssr: true,
});
