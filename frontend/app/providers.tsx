"use client";

import type { ReactNode } from "react";
import '@rainbow-me/rainbowkit/styles.css';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { hardhat, sepolia } from 'wagmi/chains';
import { metaMask, injected } from 'wagmi/connectors';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import { MetaMaskProvider } from "@/hooks/metamask/useMetaMaskProvider";
import { InMemoryStorageProvider } from "@/hooks/useInMemoryStorage";
import { MetaMaskEthersSignerProvider } from "@/hooks/metamask/useMetaMaskEthersSigner";

const config = createConfig({
  chains: [hardhat, sepolia],
  connectors: [
    metaMask(),
    injected(),
  ],
  transports: {
    [hardhat.id]: http('http://localhost:8545'),
    [sepolia.id]: http(`https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990`),
  },
  ssr: false,
  // Disable all telemetry and analytics to prevent external API calls
  enableWalletConnect: false,
  enableInjected: true,
  enableCoinbaseWallet: false,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Disable background refetching to prevent network errors
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

type Props = {
  children: ReactNode;
};

// Custom RainbowKit theme to avoid external dependencies
const customTheme = {
  blurs: {
    modalOverlay: 'blur(4px)',
  },
  colors: {
    accentColor: '#7c3aed',
    accentColorForeground: '#ffffff',
    actionButtonBorder: '#d1d5db',
    actionButtonBorderMobile: '#d1d5db',
    actionButtonSecondaryBackground: '#f9fafb',
    closeButton: '#6b7280',
    closeButtonBackground: '#f9fafb',
    connectButtonBackground: '#7c3aed',
    connectButtonBackgroundError: '#ef4444',
    connectButtonInnerBackground: '#ffffff',
    connectButtonText: '#ffffff',
    connectButtonTextError: '#ffffff',
    connectionIndicator: '#10b981',
    downloadBottomCardBackground: '#ffffff',
    downloadTopCardBackground: '#ffffff',
    error: '#ef4444',
    generalBorder: '#e5e7eb',
    generalBorderDim: '#f3f4f6',
    menuItemBackground: '#f9fafb',
    modalBackdrop: 'rgba(0, 0, 0, 0.5)',
    modalBackground: '#ffffff',
    modalBorder: '#e5e7eb',
    modalText: '#374151',
    modalTextDim: '#6b7280',
    modalTextSecondary: '#6b7280',
    profileAction: '#7c3aed',
    profileActionHover: '#581c87',
    profileForeground: '#ffffff',
    selectedOptionBorder: '#7c3aed',
    standby: '#6b7280',
  },
  fonts: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  radii: {
    actionButton: '8px',
    connectButton: '8px',
    menuButton: '8px',
    modal: '12px',
    modalMobile: '16px',
  },
  shadows: {
    connectButton: '0 4px 12px rgba(0, 0, 0, 0.1)',
    dialog: '0 8px 32px rgba(0, 0, 0, 0.32)',
    profileDetailsAction: '0 2px 6px rgba(0, 0, 0, 0.1)',
    selectedOption: '0 2px 6px rgba(0, 0, 0, 0.1)',
    selectedWallet: '0 4px 12px rgba(0, 0, 0, 0.1)',
    walletLogo: '0 2px 16px rgba(0, 0, 0, 0.04)',
  },
};

export function Providers({ children }: Props) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          locale="en"
          modalSize="compact"
          theme={customTheme}
          initialChain={hardhat}
          showRecentTransactions={false}
          // Force show wallet options
          coolMode={false}
          // Minimal configuration to avoid external API calls
          appInfo={{
            appName: 'Athlete Registration System',
            learnMoreUrl: 'http://localhost:3000',
          }}
        >
          <MetaMaskProvider>
            <MetaMaskEthersSignerProvider initialMockChains={{}}>
              <InMemoryStorageProvider>{children}</InMemoryStorageProvider>
            </MetaMaskEthersSignerProvider>
          </MetaMaskProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
