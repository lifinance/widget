import { ChainId, LiFiWidget } from '@lifi/widget'
import { useAppKit } from '@reown/appkit/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCallback } from 'react'
import { WalletHeader } from './components/WalletHeader.js'
import { WalletProvider } from './providers/WalletProvider.js'

const queryClient = new QueryClient()

function Main() {
  const { open } = useAppKit()
  const handleOnConnect = useCallback(() => {
    open?.()
  }, [open])

  return (
    <main>
      {/* Rest of your app goes here */}
      <WalletHeader />
      <LiFiWidget
        integrator="vite-example"
        config={{
          walletConfig: {
            onConnect: handleOnConnect,
          },
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
    </main>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <Main />
      </WalletProvider>
    </QueryClientProvider>
  )
}

export default App
