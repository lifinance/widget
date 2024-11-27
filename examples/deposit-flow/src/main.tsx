import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { http, WagmiProvider, createConfig } from 'wagmi'
import { arbitrum, base, mainnet, optimism } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { App } from './App'
import { WalletHeader } from './components/WalletHeader'

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
