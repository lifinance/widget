import { ChainId, LiFiWidget } from '@lifi/widget'
import { Grid2 } from '@mui/material'
import { QueryClientProvider } from '@tanstack/react-query'
import { EthersPlayground } from './components/EthersPlayground.js'
import { WalletHeader } from './components/WalletHeader.js'
import { queryClient } from './config/queryClient.js'
import { WalletProvider } from './providers/SyncedWalletProvider.js'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <WalletHeader />
        <Grid2 container spacing={2}>
          <Grid2 size={{ sm: 12, md: 7 }}>
            <LiFiWidget
              integrator="vite-example"
              config={{
                theme: {
                  container: {
                    border: '1px solid rgb(234, 234, 234)',
                    borderRadius: '16px',
                  },
                },
                sdkConfig: {
                  rpcUrls: {
                    [ChainId.SOL]: [
                      // Replace with your private Solana RPC
                      'https://chaotic-restless-putty.solana-mainnet.quiknode.pro/',
                      'https://dacey-pp61jd-fast-mainnet.helius-rpc.com/',
                    ],
                  },
                },
              }}
            />
          </Grid2>
          <Grid2 size={{ sm: 12, md: 5 }}>
            <EthersPlayground />
          </Grid2>
        </Grid2>
      </WalletProvider>
    </QueryClientProvider>
  )
}

export default App
