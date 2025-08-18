import '@rainbow-me/rainbowkit/styles.css'

import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import { queryClient } from './config/queryClient.js'
import { WalletProvider } from './providers/WalletProvider.js'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <App />
      </WalletProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
