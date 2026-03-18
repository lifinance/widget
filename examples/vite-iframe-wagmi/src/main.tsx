import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HostApp } from './App'
import './main.css'
import { WalletProvider } from './providers/WalletProvider'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <HostApp />
      </WalletProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
