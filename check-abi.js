const fs = require('fs');

try {
  const localhost = JSON.parse(fs.readFileSync('./deployments/localhost/AthleteRegistration.json', 'utf8'));
  const sepolia = JSON.parse(fs.readFileSync('./deployments/sepolia/AthleteRegistration.json', 'utf8'));

  console.log('Localhost ABI length:', localhost.abi ? localhost.abi.length : 'No ABI');
  console.log('Sepolia ABI length:', sepolia.abi ? sepolia.abi.length : 'No ABI');

  if (localhost.abi && sepolia.abi) {
    const abiEqual = JSON.stringify(localhost.abi) === JSON.stringify(sepolia.abi);
    console.log('ABI equal:', abiEqual);

    if (!abiEqual) {
      console.log('ABI difference found - this causes the genabi warning');
    }
  } else {
    console.log('Missing ABI in one or both deployments');
  }
} catch (error) {
  console.error('Error checking ABI:', error.message);
}
