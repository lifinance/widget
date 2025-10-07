import { EVMProvider } from '@lifi/wallet-provider-evm'
import { SVMProvider } from '@lifi/wallet-provider-svm'
import { ChainId, LiFiWidget } from '@lifi/widget'
import { Grid } from '@mui/material'
import { QueryClientProvider } from '@tanstack/react-query'
import { EthersPlayground } from './components/EthersPlayground'
import { WalletHeader } from './components/WalletHeader'
import { queryClient } from './config/queryClient'
import { WalletProvider } from './providers/SyncedWalletProvider'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <WalletHeader />
        <Grid container spacing={2}>
          <Grid size={{ sm: 12, md: 7 }}>
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
              walletProviders={[EVMProvider, SVMProvider]}
            />
          </Grid>
          <Grid size={{ sm: 12, md: 5 }}>
            <EthersPlayground />
          </Grid>
        </Grid>
      </WalletProvider>
    </QueryClientProvider>
  )
}

export default App
