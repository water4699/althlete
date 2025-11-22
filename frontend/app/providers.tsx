"use client";

import type { ReactNode } from "react";
import '@rainbow-me/rainbowkit/styles.css';

import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider, useChainId } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { http } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from 'react';

import { InMemoryStorageProvider } from "@/hooks/useInMemoryStorage";

// Custom localhost chain with correct chainId for Hardhat
const hardhatLocalhost = {
  id: 31337,
  name: 'Hardhat Localhost',
  network: 'hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
  blockExplorers: {
    default: { name: 'Hardhat Explorer', url: 'http://127.0.0.1:8545' },
  },
  testnet: true,
};

// Environment variable for Infura API key - fallback to demo key
const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY || 'demo-key-for-testing';

const config = getDefaultConfig({
  appName: 'Athlete Registration System',
  projectId: 'ef3325a718834a2b1b4134d3f520933d', // User's WalletConnect Project ID
  chains: [hardhatLocalhost, sepolia],
  transports: {
    [hardhatLocalhost.id]: http('http://127.0.0.1:8545', {
      batch: false,
      timeout: 60000,
    }),
    [sepolia.id]: http(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`, {
      batch: false,
      timeout: 60000,
    }),
  },
  ssr: false,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Disable background refetching to prevent network errors
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      // Add retry logic for network errors
      retry: (failureCount, error) => {
        // Don't retry on network errors (like network changes)
        if (error?.message?.includes('network changed')) {
          return false;
        }
        return failureCount < 3;
      },
      // Shorter stale time for network-dependent data
      staleTime: 30000, // 30 seconds
    },
    mutations: {
      // Retry mutations on network errors
      retry: (failureCount, error) => {
        if (error?.message?.includes('network changed')) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

type Props = {
  children: ReactNode;
};


// Internal component to handle network change events
function NetworkChangeHandler({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const chainId = useChainId();

  useEffect(() => {
    // Clear all queries when network changes to prevent stale data
    queryClient.clear();

    // Log network change for debugging
    console.log('Network changed to:', chainId);
  }, [chainId, queryClient]);

  return <>{children}</>;
}

export function Providers({ children }: Props) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <NetworkChangeHandler>
          <RainbowKitProvider
            locale="en"
            modalSize="compact"
            appInfo={{
              appName: 'Athlete Registration System',
              learnMoreUrl: 'http://localhost:3000',
            }}
          >
        <InMemoryStorageProvider>{children}</InMemoryStorageProvider>
          </RainbowKitProvider>
        </NetworkChangeHandler>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
