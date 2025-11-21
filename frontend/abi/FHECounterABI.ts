
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
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "AthleteInfoUpdated",
      "type": "event"
    },
    {
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
      "inputs": [],
      "name": "getAllEncryptedAthleteInfo",
      "outputs": [
        {
          "internalType": "euint32",
          "name": "encryptedName",
          "type": "bytes32"
        },
        {
          "internalType": "euint32",
          "name": "encryptedAge",
          "type": "bytes32"
        },
        {
          "internalType": "euint32",
          "name": "encryptedContact",
          "type": "bytes32"
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
      "inputs": [],
      "name": "getEncryptedAge",
      "outputs": [
        {
          "internalType": "euint32",
          "name": "",
          "type": "bytes32"
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
          "internalType": "euint32",
          "name": "",
          "type": "bytes32"
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
          "internalType": "euint32",
          "name": "",
          "type": "bytes32"
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
          "internalType": "externalEuint32",
          "name": "_encryptedName",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "_nameProof",
          "type": "bytes"
        },
        {
          "internalType": "externalEuint32",
          "name": "_encryptedAge",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "_ageProof",
          "type": "bytes"
        },
        {
          "internalType": "externalEuint32",
          "name": "_encryptedContact",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "_contactProof",
          "type": "bytes"
        },
        {
          "internalType": "enum AthleteRegistration.SportCategory",
          "name": "_sportCategory",
          "type": "uint8"
        }
      ],
      "name": "registerAthlete",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
} as const;

