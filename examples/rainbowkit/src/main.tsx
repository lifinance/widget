import '@rainbow-me/rainbowkit/styles.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { arbitrum, base, mainnet, optimism, polygon, zora } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'LI.FI Widget RainbowKit',
  projectId: import.meta.env.VITE_WALLET_CONNECT,
  chains: [mainnet, polygon, optimism, arbitrum, base, zora],
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
