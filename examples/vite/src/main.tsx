import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { App } from './App';
import { base, mainnet } from 'wagmi/chains';
import { injected, safe, walletConnect } from 'wagmi/connectors';

const queryClient = new QueryClient();

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

const config = createConfig({
  chains: [mainnet],
  connectors: [injected(), walletConnect({ projectId }), safe()],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <App />
      </WagmiProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
