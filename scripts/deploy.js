const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying contract...");

  // Get the contract factory
  const Voting = await ethers.getContractFactory("Voting");

  // Deploy the contract
  const voting = await Voting.deploy();

  // Wait for deployment to complete
  await voting.waitForDeployment();

  // Get the deployed contract address
  const address = voting.target; // `target` is used in Ethers.js v6 for the contract address
  console.log("Voting contract deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying contract:", error);
    process.exit(1);
  });
