
/*
  This file is auto-generated.
  Command: 'npm run genabi'
*/
export const AthleteRegistrationABI = {
  "abi": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "athlete",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "AthleteInfoUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "athlete",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "enum AthleteRegistration.SportCategory",
          "name": "category",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "AthleteRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "athlete",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "age",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "contact",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "ageRequirementMet",
          "type": "bool"
        }
      ],
      "name": "DecryptionResultsAvailable",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "enum AthleteRegistration.SportCategory",
          "name": "",
          "type": "uint8"
        }
      ],
      "name": "categoryMinAges",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "",
          "type": "uint32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "checkAgeRequirement",
      "outputs": [
        {
          "internalType": "ebool",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "decryptedName",
          "type": "string"
        },
        {
          "internalType": "uint32",
          "name": "decryptedAge",
          "type": "uint32"
        },
        {
          "internalType": "uint32",
          "name": "decryptedContact",
          "type": "uint32"
        }
      ],
      "name": "finalizeDecryption",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "athlete",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "decryptedName",
          "type": "string"
        },
        {
          "internalType": "uint32",
          "name": "decryptedAge",
          "type": "uint32"
        },
        {
          "internalType": "uint32",
          "name": "decryptedContact",
          "type": "uint32"
        }
      ],
      "name": "finalizeResults",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllEncryptedAthleteInfo",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "encryptedName",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "encryptedAge",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "encryptedContact",
          "type": "bytes"
        },
        {
          "internalType": "enum AthleteRegistration.SportCategory",
          "name": "sportCategory",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getAthleteAtIndex",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "athlete",
          "type": "address"
        }
      ],
      "name": "getDecryptedAthleteInfo",
      "outputs": [
        {
          "internalType": "string",
          "name": "decryptedName",
          "type": "string"
        },
        {
          "internalType": "uint32",
          "name": "decryptedAge",
          "type": "uint32"
        },
        {
          "internalType": "uint32",
          "name": "decryptedContact",
          "type": "uint32"
        },
        {
          "internalType": "enum AthleteRegistration.SportCategory",
          "name": "sportCategory",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "ageRequirementMet",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getEncryptedAge",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getEncryptedContact",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getEncryptedData",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getEncryptedName",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRegistrationTimestamp",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getSportCategory",
      "outputs": [
        {
          "internalType": "enum AthleteRegistration.SportCategory",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalAthletes",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isAthleteRegistered",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "protocolId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "nameHandle",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "nameInputProof",
          "type": "bytes"
        },
        {
          "internalType": "uint256",
          "name": "ageHandle",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "ageInputProof",
          "type": "bytes"
        },
        {
          "internalType": "uint256",
          "name": "contactHandle",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "contactInputProof",
          "type": "bytes"
        },
        {
          "internalType": "uint8",
          "name": "_sportCategory",
          "type": "uint8"
        }
      ],
      "name": "registerAthlete",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "encryptedName",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "encryptedAge",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "encryptedContact",
          "type": "bytes"
        },
        {
          "internalType": "uint8",
          "name": "_sportCategory",
          "type": "uint8"
        }
      ],
      "name": "registerAthleteSimple",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
} as const;

