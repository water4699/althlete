import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm, deployments } from "hardhat";
import { AthleteRegistration } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  alice: HardhatEthersSigner;
};

describe("AthleteRegistrationSepolia", function () {
  let signers: Signers;
  let athleteRegistrationContract: AthleteRegistration;
  let athleteRegistrationContractAddress: string;
  let step: number;
  let steps: number;

  function progress(message: string) {
    console.log(`${++step}/${steps} ${message}`);
  }

  before(async function () {
    if (fhevm.isMock) {
      console.warn(`This hardhat test suite can only run on Sepolia Testnet`);
      this.skip();
    }

    try {
      const athleteRegistrationDeployment = await deployments.get("AthleteRegistration");
      athleteRegistrationContractAddress = athleteRegistrationDeployment.address;
      athleteRegistrationContract = await ethers.getContractAt("AthleteRegistration", athleteRegistrationDeployment.address);
    } catch (e) {
      (e as Error).message += ". Call 'npx hardhat deploy --network sepolia'";
      throw e;
    }

    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { alice: ethSigners[0] };
  });

  beforeEach(async () => {
    step = 0;
    steps = 0;
  });

  it("register athlete and verify data", async function () {
    steps = 15;

    this.timeout(4 * 60000);

    progress("Checking if athlete is already registered...");
    const isRegistered = await athleteRegistrationContract.connect(signers.alice).isAthleteRegistered();

    if (isRegistered) {
      progress("Athlete already registered, skipping registration test");
      return;
    }

    progress("Encrypting athlete data...");
    const name = 12345;
    const age = 15;
    const contact = 67890;
    const category = 0; // Individual sports

    const encryptedName = await fhevm
      .createEncryptedInput(athleteRegistrationContractAddress, signers.alice.address)
      .add32(name)
      .encrypt();

    const encryptedAge = await fhevm
      .createEncryptedInput(athleteRegistrationContractAddress, signers.alice.address)
      .add32(age)
      .encrypt();

    const encryptedContact = await fhevm
      .createEncryptedInput(athleteRegistrationContractAddress, signers.alice.address)
      .add32(contact)
      .encrypt();

    progress(
      `Registering athlete AthleteRegistration=${athleteRegistrationContractAddress} signer=${signers.alice.address}...`,
    );
    const tx = await athleteRegistrationContract
      .connect(signers.alice)
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

    progress(`Verifying athlete registration...`);
    const isRegisteredAfter = await athleteRegistrationContract.connect(signers.alice).isAthleteRegistered();
    expect(isRegisteredAfter).to.be.true;

    progress(`Getting encrypted athlete data...`);
    const [encName, encAge, encContact, sportCategory, timestamp] = await athleteRegistrationContract
      .connect(signers.alice)
      .getAllEncryptedAthleteInfo();

    expect(sportCategory).to.eq(category);
    expect(timestamp).to.be.gt(0);

    progress(`Decrypting athlete name=${encName}...`);
    const clearName = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encName,
      athleteRegistrationContractAddress,
      signers.alice,
    );
    progress(`Decrypted name=${clearName}`);

    progress(`Decrypting athlete age=${encAge}...`);
    const clearAge = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encAge,
      athleteRegistrationContractAddress,
      signers.alice,
    );
    progress(`Decrypted age=${clearAge}`);

    progress(`Decrypting athlete contact=${encContact}...`);
    const clearContact = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encContact,
      athleteRegistrationContractAddress,
      signers.alice,
    );
    progress(`Decrypted contact=${clearContact}`);

    progress(`Checking age requirement...`);
    const ageRequirementResult = await athleteRegistrationContract.connect(signers.alice).checkAgeRequirement();
    progress(`Age requirement check completed`);

    progress(`Getting total athletes count...`);
    const totalAthletes = await athleteRegistrationContract.getTotalAthletes();
    progress(`Total athletes=${totalAthletes}`);

    // Verify decrypted values match original inputs
    expect(clearName).to.eq(name);
    expect(clearAge).to.eq(age);
    expect(clearContact).to.eq(contact);
    expect(totalAthletes).to.be.gte(1);
  });
});
