const { ethers } = require("hardhat");

async function main() {
  const privateKey = "0x6997ba8119ffba8c5133e76a945a145b2e3f02eb98ffcfd9c81cfd2cd72f8216";
  const wallet = new ethers.Wallet(privateKey);

  console.log("Private key:", privateKey);
  console.log("Derived address:", wallet.address);

  // Check balance on Sepolia
  const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990");
  const balance = await provider.getBalance(wallet.address);

  console.log("Sepolia balance:", ethers.formatEther(balance), "ETH");
  console.log("Balance (wei):", balance.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
