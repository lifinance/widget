import { EthereumProvider } from '@lifi/wallet-provider-evm'
import { SolanaProvider } from '@lifi/wallet-provider-svm'
import { ChainId, LiFiWidget } from '@lifi/widget'
import { QueryClientProvider } from '@tanstack/react-query'
import { WalletHeader } from './components/WalletHeader'
import { queryClient } from './config/queryClient'
import { WalletProvider } from './providers/SyncedWalletProvider'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <WalletHeader />
        <LiFiWidget
          integrator="vite-example"
          config={{
            theme: {
              container: {
                height: 'fit-content',
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
          providers={[EthereumProvider(), SolanaProvider()]}
        />
      </WalletProvider>
    </QueryClientProvider>
  )
}

export default App
