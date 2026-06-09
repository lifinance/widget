import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

const queryClient = new QueryClient()

// Clean internal wallet management: no host WagmiProvider, no WalletHeader.
// Matches the partner's setup (they do not wrap their own WagmiProvider).
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
