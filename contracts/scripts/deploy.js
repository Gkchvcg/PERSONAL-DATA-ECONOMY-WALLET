const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const token = await MockERC20.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("MockERC20 (DATA) deployed to:", tokenAddress);

  const DataMarketplace = await hre.ethers.getContractFactory("DataMarketplace");
  const marketplace = await DataMarketplace.deploy(tokenAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("DataMarketplace deployed to:", marketplaceAddress);

  console.log("\n--- Copy to .env ---");
  console.log("NEXT_PUBLIC_DATA_TOKEN_ADDRESS=" + tokenAddress);
  console.log("NEXT_PUBLIC_MARKETPLACE_ADDRESS=" + marketplaceAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
