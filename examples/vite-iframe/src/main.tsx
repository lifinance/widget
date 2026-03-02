import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HostApp } from './App'
import { HostWalletProvider } from './providers/HostWalletProvider'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HostWalletProvider>
        <HostApp />
      </HostWalletProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
