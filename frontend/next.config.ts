import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // Required by FHEVM and Base Account SDK
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          // Allow necessary external resources for wallet functionality
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' http://localhost:8545 ws://localhost:8545 https://metamask-sdk.api.cx.metamask.io https://mm-sdk-analytics.api.cx.metamask.io wss://*.walletconnect.org https://*.walletconnect.org; img-src 'self' data: https: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;",
          },
        ],
      },
    ];
  },
  // Suppress some warnings in development
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // Disable experimental features that might cause issues
  experimental: {
    // Disable webpack build worker to reduce console noise
    webpackBuildWorker: false,
  },
  // Disable telemetry
  telemetry: false,
  // Environment variables
  env: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: 'c9e6b8c2f1d4e9a855f7e6b8c2f1d4e9',
  },
};

export default nextConfig;
