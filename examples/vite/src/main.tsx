import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.js'
import { WalletHeader } from './components/WalletHeader.js'
import { WalletProvider } from './providers/WalletProvider.js'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <WalletHeader />
        <App />
      </WalletProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
