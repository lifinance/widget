import { createTheme, ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HostApp } from './App'
import { EcosystemProviders } from './providers/EcosystemProviders'
import { HostWalletProvider } from './providers/HostWalletProvider'

const queryClient = new QueryClient()
const theme = createTheme({ cssVariables: true })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <HostWalletProvider>
          <EcosystemProviders>
            <HostApp />
          </EcosystemProviders>
        </HostWalletProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
)
