const func = async function (hre) {
  const { deploy } = hre.deployments;

  // Get the first signer (which should be our configured private key account)
  const [deployerSigner] = await hre.ethers.getSigners();
  const deployerAddress = await deployerSigner.getAddress();

  console.log("Deploying from address:", deployerAddress);

  const deployedAthleteRegistration = await deploy("AthleteRegistration", {
    from: deployerAddress,
    log: true,
  });

  console.log(`AthleteRegistration contract: `, deployedAthleteRegistration.address);
};

func.id = "deploy_athleteRegistration"; // id required to prevent reexecution
func.tags = ["AthleteRegistration"];

module.exports = func;
