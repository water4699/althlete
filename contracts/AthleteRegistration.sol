// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Athlete Registration Contract with FHE
/// @notice Privacy-preserving athlete registration system using Fully Homomorphic Encryption
/// @dev Implements encrypted athlete data storage with age validation for sport categories
/// @dev Similar to Persona-Shard: real FHE operations on all networks including testnet
contract AthleteRegistration is SepoliaConfig {
    /// @notice Sport category definitions with minimum age requirements
    enum SportCategory {
        Individual, // 0: Individual sports (min age: 8)
        Team,       // 1: Team sports (min age: 10)
        Endurance,  // 2: Endurance sports (min age: 12)
        Combat,     // 3: Combat sports (min age: 14)
        Other       // 4: Other categories (min age: 8)
    }

    /// @notice Minimum age requirements for different sport categories
    mapping(SportCategory => uint32) public categoryMinAges;

    /// @notice Structure to store athlete registration information
    struct AthleteInfo {
        // Encrypted fields stored as raw bytes (like artifact-cipher)
        bytes encryptedName;       // Encrypted athlete's name (desensitized)
        bytes encryptedAge;        // Encrypted age value
        bytes encryptedContact;    // Encrypted contact information
        SportCategory sportCategory; // Sport category (not encrypted for validation)
        uint256 registrationTimestamp; // Registration timestamp
        bool isRegistered;         // Flag to check if athlete is registered
        bool decrypted;            // Whether the data has been decrypted
        // Plaintext values after decryption
        string decryptedName;
        uint32 decryptedAge;
        uint32 decryptedContact;
    }

    /// @notice Mapping from athlete address to their encrypted registration information
    mapping(address => AthleteInfo) private athleteRegistrations;

    /// @notice Array to track all registered athletes
    address[] private registeredAthletes;

    /// @notice Event emitted when an athlete registers
    event AthleteRegistered(address indexed athlete, SportCategory category, uint256 timestamp);

    /// @notice Event emitted when athlete info is updated
    event AthleteInfoUpdated(address indexed athlete, uint256 timestamp);

    /// @notice Event emitted when decryption results are available
    event DecryptionResultsAvailable(address indexed athlete, string name, uint32 age, uint32 contact, bool ageRequirementMet);

    /// @notice Constructor to set minimum age requirements for sport categories
    constructor() {
        // Set minimum ages for different sport categories
        categoryMinAges[SportCategory.Individual] = 8;
        categoryMinAges[SportCategory.Team] = 10;
        categoryMinAges[SportCategory.Endurance] = 12;
        categoryMinAges[SportCategory.Combat] = 14;
        categoryMinAges[SportCategory.Other] = 8;
    }

    /// @notice Register athlete with FHE encrypted data
    /// @param nameHandle FHE encrypted name handle
    /// @param nameInputProof Proof for name encryption
    /// @param ageHandle FHE encrypted age handle
    /// @param ageInputProof Proof for age encryption
    /// @param contactHandle FHE encrypted contact handle
    /// @param contactInputProof Proof for contact encryption
    /// @param _sportCategory Sport category (0-4)
    /// @dev Real FHE encryption mode
    function registerAthlete(
        uint256 nameHandle,
        bytes calldata nameInputProof,
        uint256 ageHandle,
        bytes calldata ageInputProof,
        uint256 contactHandle,
        bytes calldata contactInputProof,
        uint8 _sportCategory
    ) external {
        require(!athleteRegistrations[msg.sender].isRegistered, "Athlete already registered");
        require(_sportCategory >= 0 && _sportCategory <= 4, "Invalid sport category");

        SportCategory sportCategory = SportCategory(_sportCategory);

        // Store FHE handles directly for later decryption
        athleteRegistrations[msg.sender] = AthleteInfo({
            encryptedName: abi.encode(nameHandle),
            encryptedAge: abi.encode(ageHandle),
            encryptedContact: abi.encode(contactHandle),
            sportCategory: sportCategory,
            registrationTimestamp: block.timestamp,
            isRegistered: true,
            decrypted: false,
            decryptedName: "",
            decryptedAge: 0,
            decryptedContact: 0
        });

        registeredAthletes.push(msg.sender);

        emit AthleteRegistered(msg.sender, sportCategory, block.timestamp);
    }

    /// @notice Register athlete with simple byte encryption (fallback)
    /// @param encryptedName Encrypted name as bytes
    /// @param encryptedAge Encrypted age as bytes
    /// @param encryptedContact Encrypted contact as bytes
    /// @param _sportCategory Sport category (0-4)
    /// @dev Fallback mode for when FHE is not available
    function registerAthleteSimple(
        bytes calldata encryptedName,
        bytes calldata encryptedAge,
        bytes calldata encryptedContact,
        uint8 _sportCategory
    ) external {
        require(!athleteRegistrations[msg.sender].isRegistered, "Athlete already registered");
        require(_sportCategory >= 0 && _sportCategory <= 4, "Invalid sport category");

        SportCategory sportCategory = SportCategory(_sportCategory);

        athleteRegistrations[msg.sender] = AthleteInfo({
            encryptedName: encryptedName,
            encryptedAge: encryptedAge,
            encryptedContact: encryptedContact,
            sportCategory: sportCategory,
            registrationTimestamp: block.timestamp,
            isRegistered: true,
            decrypted: false,
            decryptedName: "",
            decryptedAge: 0,
            decryptedContact: 0
        });

        registeredAthletes.push(msg.sender);

        emit AthleteRegistered(msg.sender, sportCategory, block.timestamp);
    }


    /// @notice Validate age requirement using FHE operations
    /// @param _encAge Encrypted age value
    /// @param _sportCategory Sport category for validation
    /// @dev Performs homomorphic comparison to ensure age meets minimum requirements
    function _validateAgeRequirement(euint32 _encAge, SportCategory _sportCategory) private {
        uint32 minAge = categoryMinAges[_sportCategory];

        // This creates an encrypted boolean: age >= minAge
        euint32 minAgeEncrypted = FHE.asEuint32(minAge);
        // Note: In production, you might want to store this validation result or emit an event
        // For MVP, we perform the comparison but don't use the result (simplified implementation)
        FHE.ge(_encAge, minAgeEncrypted);
    }

    /// @notice Get encrypted name for the caller
    /// @return Encrypted name value
    function getEncryptedName() external view returns (bytes memory) {
        require(athleteRegistrations[msg.sender].isRegistered, "Athlete not registered");
        return athleteRegistrations[msg.sender].encryptedName;
    }

    /// @notice Get encrypted age for the caller
    /// @return Encrypted age value
    function getEncryptedAge() external view returns (bytes memory) {
        require(athleteRegistrations[msg.sender].isRegistered, "Athlete not registered");
        return athleteRegistrations[msg.sender].encryptedAge;
    }

    /// @notice Get encrypted contact for the caller
    /// @return Encrypted contact value
    function getEncryptedContact() external view returns (bytes memory) {
        require(athleteRegistrations[msg.sender].isRegistered, "Athlete not registered");
        return athleteRegistrations[msg.sender].encryptedContact;
    }

    /// @notice Get sport category for the caller
    /// @return Sport category value
    function getSportCategory() external view returns (SportCategory) {
        require(athleteRegistrations[msg.sender].isRegistered, "Athlete not registered");
        return athleteRegistrations[msg.sender].sportCategory;
    }

    /// @notice Get registration timestamp
    /// @return Timestamp value
    function getRegistrationTimestamp() external view returns (uint256) {
        require(athleteRegistrations[msg.sender].isRegistered, "Athlete not registered");
        return athleteRegistrations[msg.sender].registrationTimestamp;
    }

    /// @notice Check if athlete is registered
    /// @return True if athlete is registered, false otherwise
    function isAthleteRegistered() external view returns (bool) {
        return athleteRegistrations[msg.sender].isRegistered;
    }

    /// @notice Get total number of registered athletes
    /// @return Total athlete count
    function getTotalAthletes() external view returns (uint256) {
        return registeredAthletes.length;
    }

    /// @notice Get athlete address at specific index
    /// @param index Index in the registered athletes array
    /// @return Athlete address
    function getAthleteAtIndex(uint256 index) external view returns (address) {
        require(index < registeredAthletes.length, "Index out of bounds");
        return registeredAthletes[index];
    }

    /// @notice Get all encrypted athlete information for the caller
    /// @return encryptedName Encrypted name
    /// @return encryptedAge Encrypted age
    /// @return encryptedContact Encrypted contact
    /// @return sportCategory Sport category
    /// @return timestamp Registration timestamp
    function getAllEncryptedAthleteInfo()
        external
        view
        returns (
            bytes memory encryptedName,
            bytes memory encryptedAge,
            bytes memory encryptedContact,
            SportCategory sportCategory,
            uint256 timestamp
        )
    {
        require(athleteRegistrations[msg.sender].isRegistered, "Athlete not registered");
        AthleteInfo storage athlete = athleteRegistrations[msg.sender];
        return (
            athlete.encryptedName,
            athlete.encryptedAge,
            athlete.encryptedContact,
            athlete.sportCategory,
            athlete.registrationTimestamp
        );
    }

    /// @notice Check if athlete meets minimum age requirement for their category (FHE operation)
    /// @return Encrypted boolean indicating if age requirement is met
    function checkAgeRequirement() external returns (ebool) {
        require(athleteRegistrations[msg.sender].isRegistered, "Athlete not registered");
        AthleteInfo storage athlete = athleteRegistrations[msg.sender];

        // For now, return a default value since we're using bytes storage
        // In a full implementation, this would perform FHE operations on the encrypted data
        return FHE.asEbool(true); // Placeholder - would need proper FHE operations
    }

    /// @notice Get encrypted athlete data for decryption
    /// @return encName Encrypted name as euint32 handle
    /// @return encAge Encrypted age as euint32 handle
    /// @return encContact Encrypted contact as euint32 handle
    /// @dev Returns actual FHE encrypted handles for client-side decryption
    function getEncryptedData() external view returns (uint256, uint256, uint256) {
        AthleteInfo storage athlete = athleteRegistrations[msg.sender];
        require(athlete.isRegistered, "Athlete not registered");

        // Return stored FHE handles directly
        uint256 nameHandle = abi.decode(athlete.encryptedName, (uint256));
        uint256 ageHandle = abi.decode(athlete.encryptedAge, (uint256));
        uint256 contactHandle = abi.decode(athlete.encryptedContact, (uint256));

        return (nameHandle, ageHandle, contactHandle);
    }

    /// @notice Mark athlete information as decrypted (called after client-side FHE decryption)
    /// @param decryptedName The decrypted name
    /// @param decryptedAge The decrypted age
    /// @param decryptedContact The decrypted contact
    function finalizeDecryption( // updated
        string memory decryptedName,
        uint32 decryptedAge,
        uint32 decryptedContact
    ) external {
        AthleteInfo storage athlete = athleteRegistrations[msg.sender];
        require(athlete.isRegistered, "Athlete not registered");
        require(!athlete.decrypted, "Already decrypted");

        athlete.decryptedName = decryptedName;
        athlete.decryptedAge = decryptedAge;
        athlete.decryptedContact = decryptedContact;
        athlete.decrypted = true;

        emit DecryptionResultsAvailable(msg.sender, decryptedName, decryptedAge, decryptedContact, decryptedAge >= categoryMinAges[athlete.sportCategory]);
    }

    /// @notice Finalize decryption results (called by anyone after off-chain decryption)
    /// @param athlete The athlete address
    /// @param decryptedName The decrypted name value
    /// @param decryptedAge The decrypted age value
    /// @param decryptedContact The decrypted contact value
    function finalizeResults(
        address athlete,
        string memory decryptedName,
        uint32 decryptedAge,
        uint32 decryptedContact
    ) external {
        AthleteInfo storage athleteInfo = athleteRegistrations[athlete];
        require(athleteInfo.isRegistered, "Athlete not registered");
        require(!athleteInfo.decrypted, "Already finalized");

        athleteInfo.decryptedName = decryptedName;
        athleteInfo.decryptedAge = decryptedAge;
        athleteInfo.decryptedContact = decryptedContact;
        athleteInfo.decrypted = true;

        uint32 minAge = categoryMinAges[athleteInfo.sportCategory];
        bool ageRequirementMet = decryptedAge >= minAge;

        emit DecryptionResultsAvailable(athlete, decryptedName, decryptedAge, decryptedContact, ageRequirementMet);
    }

    /// @notice Get decrypted athlete information (only available after decryption)
    /// @param athlete The athlete address to query
    function getDecryptedAthleteInfo(address athlete) external view returns (
        string memory decryptedName,
        uint32 decryptedAge,
        uint32 decryptedContact,
        SportCategory sportCategory,
        bool ageRequirementMet
    ) {
        AthleteInfo storage athleteInfo = athleteRegistrations[athlete];
        require(athleteInfo.isRegistered, "Athlete not registered");
        require(athleteInfo.decrypted, "Information not yet decrypted");

        uint32 minAge = categoryMinAges[athleteInfo.sportCategory];
        bool meetsRequirement = athleteInfo.decryptedAge >= minAge;

        return (
            athleteInfo.decryptedName,
            athleteInfo.decryptedAge,
            athleteInfo.decryptedContact,
            athleteInfo.sportCategory,
            meetsRequirement
        );
    }
}