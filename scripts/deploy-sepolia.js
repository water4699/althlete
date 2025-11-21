const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying to Sepolia...");

  // Use private key directly
  const privateKey = "0x6997ba8119ffba8c5133e76a945a145b2e3f02eb98ffcfd9c81cfd2cd72f8216";
  const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990");
  const wallet = new ethers.Wallet(privateKey, provider);

  const deployerAddress = wallet.address;
  const balance = await provider.getBalance(deployerAddress);

  console.log("Deploying from:", deployerAddress);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy the contract
  const AthleteRegistration = await ethers.getContractFactory("AthleteRegistration", wallet);
  const athleteRegistration = await AthleteRegistration.deploy();

  await athleteRegistration.waitForDeployment();

  const contractAddress = await athleteRegistration.getAddress();
  console.log("AthleteRegistration deployed to:", contractAddress);

  // Save deployment info
  const fs = require("fs");
  const path = require("path");

  const deploymentDir = path.join(__dirname, "../deployments/sepolia");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  const deploymentInfo = {
    address: contractAddress,
    deployer: deployerAddress,
    network: "sepolia",
    chainId: 11155111,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(deploymentDir, "AthleteRegistration.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment info saved to:", path.join(deploymentDir, "AthleteRegistration.json"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
