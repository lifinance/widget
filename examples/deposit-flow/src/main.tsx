import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { arbitrum, base, mainnet, optimism } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { App } from './App.js'
import { WalletHeader } from './components/WalletHeader.js'

const queryClient = new QueryClient()

const _projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

const config = createConfig({
  chains: [mainnet, base, optimism, arbitrum],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
  },
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <WalletHeader />
        <App />
      </WagmiProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
