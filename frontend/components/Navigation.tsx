"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Navigation() {
  return (
    <>
      {/* Header with glassmorphism effect */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg">
              🏃‍♂️
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-white">Athlete Registration System</p>
              <p className="text-sm text-white/60">FHE Privacy Protection Platform</p>
            </div>
          </div>
          <ConnectButton showBalance={false} />
        </div>
      </header>

      {/* Hero section */}
      <section className="py-20 px-6 text-center bg-gradient-to-br from-white/10 to-white/5">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-2xl leading-tight">
            Privacy-Preserving Athlete Registration System
          </h1>
          <p className="text-xl text-white/90 mb-8 drop-shadow-lg max-w-2xl mx-auto">
            Using Fully Homomorphic Encryption (FHE) technology to ensure your athlete data remains completely private during registration, storage, and access.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-3 text-white font-medium">
              🏃‍♂️ Athlete Registration
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-3 text-white font-medium">
              🔒 FHE Encryption
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-3 text-white font-medium">
              📊 Privacy Protection
            </div>
          </div>
        </div>
      </section>
    </>
  );
}