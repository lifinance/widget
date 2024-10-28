import { ChainId, LiFiWidget } from '@lifi/widget'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletHeader } from './components/WalletHeader'
import { WalletProvider } from './providers/WalletProvider'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <WalletHeader />
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
      </WalletProvider>
    </QueryClientProvider>
  )
}
