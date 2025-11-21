import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { AthleteRegistration, AthleteRegistration__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("AthleteRegistration")) as AthleteRegistration__factory;
  const athleteRegistrationContract = (await factory.deploy()) as AthleteRegistration;
  const athleteRegistrationContractAddress = await athleteRegistrationContract.getAddress();

  return { athleteRegistrationContract, athleteRegistrationContractAddress };
}

describe("AthleteRegistration", function () {
  let signers: Signers;
  let athleteRegistrationContract: AthleteRegistration;
  let athleteRegistrationContractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async function () {
    // Check whether the tests are running against an FHEVM mock environment
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }

    ({ athleteRegistrationContract, athleteRegistrationContractAddress } = await deployFixture());
  });

  it("should deploy with correct minimum age requirements", async function () {
    const individualMinAge = await athleteRegistrationContract.categoryMinAges(0); // Individual
    const teamMinAge = await athleteRegistrationContract.categoryMinAges(1); // Team
    const enduranceMinAge = await athleteRegistrationContract.categoryMinAges(2); // Endurance
    const combatMinAge = await athleteRegistrationContract.categoryMinAges(3); // Combat
    const otherMinAge = await athleteRegistrationContract.categoryMinAges(4); // Other

    expect(individualMinAge).to.eq(8);
    expect(teamMinAge).to.eq(10);
    expect(enduranceMinAge).to.eq(12);
    expect(combatMinAge).to.eq(14);
    expect(otherMinAge).to.eq(8);
  });

  it("should register an athlete successfully", async function () {
    // Encrypt athlete data
    const name = 12345; // Demo name as number
    const age = 15;
    const contact = 67890; // Demo contact as number
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

    // Register athlete
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

    // Verify registration
    const isRegistered = await athleteRegistrationContract.connect(signers.alice).isAthleteRegistered();
    expect(isRegistered).to.be.true;

    const totalAthletes = await athleteRegistrationContract.getTotalAthletes();
    expect(totalAthletes).to.eq(1);

    const sportCategory = await athleteRegistrationContract.connect(signers.alice).getSportCategory();
    expect(sportCategory).to.eq(category);
  });

  it("should prevent double registration", async function () {
    // Encrypt athlete data
    const name = 12345;
    const age = 15;
    const contact = 67890;
    const category = 0;

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

    // Register athlete first time
    await athleteRegistrationContract
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

    // Try to register again - should fail
    await expect(
      athleteRegistrationContract
        .connect(signers.alice)
        .registerAthlete(
          encryptedName.handles[0],
          encryptedName.inputProof,
          encryptedAge.handles[0],
          encryptedAge.inputProof,
          encryptedContact.handles[0],
          encryptedContact.inputProof,
          category
        )
    ).to.be.revertedWith("Athlete already registered");
  });

  it("should decrypt athlete information correctly", async function () {
    // Register athlete
    const name = 12345;
    const age = 15;
    const contact = 67890;
    const category = 1; // Team sports

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

    await athleteRegistrationContract
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

    // Get encrypted data
    const encName = await athleteRegistrationContract.connect(signers.alice).getEncryptedName();
    const encAge = await athleteRegistrationContract.connect(signers.alice).getEncryptedAge();
    const encContact = await athleteRegistrationContract.connect(signers.alice).getEncryptedContact();

    // Decrypt and verify
    const clearName = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encName,
      athleteRegistrationContractAddress,
      signers.alice,
    );

    const clearAge = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encAge,
      athleteRegistrationContractAddress,
      signers.alice,
    );

    const clearContact = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encContact,
      athleteRegistrationContractAddress,
      signers.alice,
    );

    expect(clearName).to.eq(name);
    expect(clearAge).to.eq(age);
    expect(clearContact).to.eq(contact);
  });

  it("should reject invalid sport category", async function () {
    const name = 12345;
    const age = 15;
    const contact = 67890;
    const invalidCategory = 10; // Invalid category (out of range)

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

    await expect(
      athleteRegistrationContract
        .connect(signers.alice)
        .registerAthlete(
          encryptedName.handles[0],
          encryptedName.inputProof,
          encryptedAge.handles[0],
          encryptedAge.inputProof,
          encryptedContact.handles[0],
          encryptedContact.inputProof,
          invalidCategory
        )
    ).to.be.revertedWith("Invalid sport category");
  });
});
