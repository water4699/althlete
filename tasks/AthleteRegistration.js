const { task } = require("hardhat/config");

/**
 * Example:
 *   - npx hardhat --network localhost task:athlete-address
 */
task("task:athlete-address", "Prints the AthleteRegistration address").setAction(async function (_taskArguments, hre) {
  const { deployments } = hre;

  const athleteRegistration = await deployments.get("AthleteRegistration");

  console.log("AthleteRegistration address is " + athleteRegistration.address);
});

/**
 * Example:
 *   - npx hardhat --network localhost task:register-athlete --name 12345 --age 15 --contact 67890 --category 0
 */
task("task:register-athlete", "Calls the registerAthlete() function")
  .addOptionalParam("address", "Optionally specify the contract address")
  .addParam("name", "The athlete's name (as number)")
  .addParam("age", "The athlete's age")
  .addParam("contact", "The athlete's contact info (as number)")
  .addParam("category", "The sport category (0-4)")
  .setAction(async function (taskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const name = parseInt(taskArguments.name);
    const age = parseInt(taskArguments.age);
    const contact = parseInt(taskArguments.contact);
    const category = parseInt(taskArguments.category);

    await fhevm.initializeCLIApi();

    const deployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("AthleteRegistration");

    const signers = await ethers.getSigners();
    const contract = await ethers.getContractAt("AthleteRegistration", deployment.address);

    // Encrypt the values
    const encryptedName = await fhevm
      .createEncryptedInput(deployment.address, signers[0].address)
      .add32(name)
      .encrypt();

    const encryptedAge = await fhevm
      .createEncryptedInput(deployment.address, signers[0].address)
      .add32(age)
      .encrypt();

    const encryptedContact = await fhevm
      .createEncryptedInput(deployment.address, signers[0].address)
      .add32(contact)
      .encrypt();

    // Register the athlete
    const tx = await contract
      .connect(signers[0])
      .registerAthlete(
        encryptedName.handles[0],
        encryptedName.inputProof,
        encryptedAge.handles[0],
        encryptedAge.inputProof,
        encryptedContact.handles[0],
        encryptedContact.inputProof,
        category
      );

    await tx.wait();
    console.log("Athlete registration succeeded!");
  });

/**
 * Example:
 *   - npx hardhat --network localhost task:get-total-athletes
 */
task("task:get-total-athletes", "Gets the total number of registered athletes")
  .addOptionalParam("address", "Optionally specify the contract address")
  .setAction(async function (taskArguments, hre) {
    const { ethers, deployments } = hre;

    const deployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("AthleteRegistration");

    const contract = await ethers.getContractAt("AthleteRegistration", deployment.address);

    const totalAthletes = await contract.getTotalAthletes();

    console.log(`Total registered athletes: ${totalAthletes}`);
  });