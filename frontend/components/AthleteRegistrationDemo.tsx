"use client";

import { useState } from "react";
import { useFhevm } from "../fhevm/useFhevm";
import { useInMemoryStorage } from "../hooks/useInMemoryStorage";
import { useMetaMaskEthersSigner } from "../hooks/metamask/useMetaMaskEthersSigner";
import { useAthleteRegistration, SportCategory } from "@/hooks/useAthleteRegistration";

export const AthleteRegistrationDemo = () => {
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();

  const {
    provider,
    chainId,
    accounts,
    isConnected,
    connect,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  } = useMetaMaskEthersSigner();

  const initialMockChains = {};

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
    error: fhevmError,
  } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true,
  });

  const athleteRegistration = useAthleteRegistration({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage,
    eip1193Provider: provider,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  });

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact: "",
    sportCategory: SportCategory.Individual,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.age || !formData.contact) {
      alert("Please fill in all fields");
      return;
    }

    // Validate that age and contact are valid numbers
    const age = parseInt(formData.age);
    const contact = parseInt(formData.contact);

    if (isNaN(age) || isNaN(contact)) {
      alert("Please enter valid numbers for age and contact");
      return;
    }

    // Name can be any string (English, etc.)
    await athleteRegistration.registerAthlete(formData.name, age, contact, formData.sportCategory);
  };

  const getCategoryName = (category: SportCategory) => {
    switch (category) {
      case SportCategory.Individual: return "Individual Sports";
      case SportCategory.Team: return "Team Sports";
      case SportCategory.Endurance: return "Endurance Sports";
      case SportCategory.Combat: return "Combat Sports";
      case SportCategory.Other: return "Other Sports";
      default: return "Unknown";
    }
  };

  const getMinAge = (category: SportCategory) => {
    switch (category) {
      case SportCategory.Individual: return 8;
      case SportCategory.Team: return 10;
      case SportCategory.Endurance: return 12;
      case SportCategory.Combat: return 14;
      case SportCategory.Other: return 8;
      default: return 8;
    }
  };


  // Always render the main content, but show different sections based on state
  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div className="animate-fade-in">
        {/* Connection Status */}
        {!isConnected && (
          <div className="mb-8">
            <div className="card max-w-md mx-auto text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6 shadow-lg">
                🏃‍♂️
              </div>
              <h2 className="text-2xl font-bold text-slate-100 mb-4">Connect Wallet</h2>
              <p className="text-slate-400 mb-6">Please connect your wallet to start athlete registration</p>
              <button
                className="btn-primary w-full"
                onClick={() => connect()}
              >
                🔗 Connect Wallet
              </button>
            </div>
          </div>
        )}

        {/* Main Registration Section */}
        {isConnected && (
          <div className="grid lg:grid-cols-2 gap-8">
          {/* Registration Form */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                📝
              </div>
                  <h2 className="text-2xl font-bold text-slate-100">Athlete Registration</h2>
            </div>

            {athleteRegistration.isRegistered ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-2">Registration Successful!</h3>
                <p className="text-slate-400">Your athlete information has been securely encrypted and stored.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="space-y-6">
                <div className="form-group">
                  <label className="form-label text-slate-100">Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label text-slate-100">Age</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label text-slate-100">Contact Info (as number)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter contact info (as number)"
                    value={formData.contact}
                    onChange={(e) => handleInputChange("contact", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label text-slate-100">Sport Category</label>
                  <select
                    className="input-field"
                    value={formData.sportCategory}
                    onChange={(e) => handleInputChange("sportCategory", parseInt(e.target.value))}
                  >
                    <option value={SportCategory.Individual}>
                      🏃‍♂️ Individual Sports (Min age: 8)
                    </option>
                    <option value={SportCategory.Team}>
                      ⚽ Team Sports (Min age: 10)
                    </option>
                    <option value={SportCategory.Endurance}>
                      🏊‍♂️ Endurance Sports (Min age: 12)
                    </option>
                    <option value={SportCategory.Combat}>
                      🥊 Combat Sports (Min age: 14)
                    </option>
                    <option value={SportCategory.Other}>
                      🎯 Other Sports (Min age: 8)
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={!athleteRegistration.canRegister}
                >
                  {athleteRegistration.canRegister
                    ? "🚀 Register Athlete"
                    : athleteRegistration.isRegistering
                      ? "⏳ Registering..."
                      : "❌ Cannot Register"}
                </button>
              </form>
            )}
          </div>

          {/* Athlete Information Display */}
          <div className="space-y-6">
            {athleteRegistration.isRegistered && athleteRegistration.athleteInfo && (
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
                    🔒
                  </div>
                  <h2 className="text-2xl font-bold text-slate-100">Encrypted Information</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-800 rounded-lg">
                    <span className="font-medium text-slate-200">Sport Category</span>
                    <span className="text-slate-100">{getCategoryName(athleteRegistration.athleteInfo.sportCategory)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-800 rounded-lg">
                    <span className="font-medium text-slate-200">Registration Time</span>
                    <span className="text-slate-100 text-sm">
                      {new Date(Number(athleteRegistration.athleteInfo.registrationTimestamp) * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    className="btn-primary w-full"
                    disabled={!athleteRegistration.canDecrypt}
                    onClick={athleteRegistration.decryptAthleteInfo}
                  >
                    {athleteRegistration.canDecrypt
                      ? "🔓 Decrypt Info"
                      : athleteRegistration.isDecrypting
                        ? "⏳ Decrypting..."
                        : "❌ No Info to Decrypt"}
                  </button>
                </div>
              </div>
            )}

            {athleteRegistration.clearAthleteInfo && (
              <div className="card border-2 border-green-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                    ✅
                  </div>
                  <h2 className="text-2xl font-bold text-slate-100">Decrypted Information (Private)</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between items-center p-4 bg-slate-800 rounded-lg border border-slate-600">
                    <span className="font-medium text-slate-200">Name</span>
                    <span className="text-slate-100 font-mono">{athleteRegistration.clearAthleteInfo.name.toString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-800 rounded-lg border border-slate-600">
                    <span className="font-medium text-slate-200">Age</span>
                    <span className="text-slate-100 font-mono">{athleteRegistration.clearAthleteInfo.age.toString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-800 rounded-lg border border-slate-600">
                    <span className="font-medium text-slate-200">Contact Info</span>
                    <span className="text-slate-100 font-mono">{athleteRegistration.clearAthleteInfo.contact.toString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-800 rounded-lg border border-slate-600">
                    <span className="font-medium text-slate-200">Minimum Category Age</span>
                    <span className="text-slate-100">{getMinAge(athleteRegistration.clearAthleteInfo.sportCategory)} years</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  className="btn-primary"
                  disabled={!athleteRegistration.canRefresh}
                  onClick={athleteRegistration.refreshAthleteInfo}
                >
                  🔄 Refresh Info
                </button>
                <button
                  className="btn-primary"
                  disabled={!athleteRegistration.canCheckAge}
                  onClick={athleteRegistration.checkAgeRequirement}
                >
                  📊 Check Age Requirements
                </button>
              </div>
            </div>

            {/* Status Messages */}
            {(athleteRegistration.message || athleteRegistration.error) && (
              <div className={`message ${athleteRegistration.error ? 'error' : 'success'}`}>
                <div className="flex items-center gap-2">
                  {athleteRegistration.error ? '❌' : '✅'}
                  <span className="font-medium">
                    {athleteRegistration.message || athleteRegistration.error?.message}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="glass-dark rounded-xl p-6 max-w-4xl mx-auto">
            <p className="text-slate-400">
              © 2024 Athlete Registration System. Privacy protection using FHE technology.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
};