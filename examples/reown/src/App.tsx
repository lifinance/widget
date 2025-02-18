import { ChainId, LiFiWidget } from '@lifi/widget'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletHeader } from './components/WalletHeader'
import { BasicWalletProvider } from './providers/BasicWalletProvider'
import { WalletProviderWithLiFiChains } from './providers/WalletProviderWithLiFiChains'

// By default the network list on AppKit switcher is synced with LiFi supported chains, change this to true to try the basic demo
const IS_BASIC_DEMO = false

const queryClient = new QueryClient()

function BasicApp() {
  return (
    <BasicWalletProvider>
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
    </BasicWalletProvider>
  )
}

function AppWithLiFiChains() {
  return (
    <WalletProviderWithLiFiChains>
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
    </WalletProviderWithLiFiChains>
  )
}

function App() {
  return (
    <main>
      <QueryClientProvider client={queryClient}>
        {IS_BASIC_DEMO ? <BasicApp /> : <AppWithLiFiChains />}
      </QueryClientProvider>
    </main>
  )
}

export default App
