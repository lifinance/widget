import {
  useDynamicContext,
  useIsLoggedIn,
  useReinitialize,
} from '@dynamic-labs/sdk-react-core'
import { EVMProvider } from '@lifi/wallet-provider-evm'
import { SVMProvider } from '@lifi/wallet-provider-svm'
import { UTXOProvider } from '@lifi/wallet-provider-utxo'
import { ChainId, LiFiWidget } from '@lifi/widget'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletHeader } from './components/WalletHeader'
import { WalletProvider } from './providers/WalletProvider'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <Main />
      </WalletProvider>
    </QueryClientProvider>
  )
}

export function Main() {
  const { setShowAuthFlow } = useDynamicContext()
  const isLoggedIn = useIsLoggedIn()
  const reInitialize = useReinitialize()

  const handleOnConnect = async () =>
    isLoggedIn ? reInitialize() : setShowAuthFlow(true)

  return (
    <>
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
        providers={[EVMProvider(), SVMProvider(), UTXOProvider()]}
      />
    </>
  )
}
