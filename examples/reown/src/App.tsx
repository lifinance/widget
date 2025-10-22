import { ChainId, LiFiWidget } from '@lifi/widget'
import { BitcoinProvider } from '@lifi/widget-provider-bitcoin'
import { EthereumProvider } from '@lifi/widget-provider-ethereum'
import { SolanaProvider } from '@lifi/widget-provider-solana'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletHeader } from './components/WalletHeader'
import { WalletProvider } from './providers/WalletProvider'

const queryClient = new QueryClient()

function App() {
  return (
    <main>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          {/* Rest of your app goes here */}
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
            providers={[
              EthereumProvider(),
              SolanaProvider(),
              BitcoinProvider(),
            ]}
          />
        </WalletProvider>
      </QueryClientProvider>
    </main>
  )
}

export default App
