import { LiFiWidget } from '@lifi/widget'
import { EthereumProvider } from '@lifi/widget-provider-ethereum'
import { QueryClientProvider } from '@tanstack/react-query'
import { WalletHeader } from './components/WalletHeader'
import { queryClient } from './config/queryClient'
import { WalletProvider } from './providers/WalletProvider'

function App() {
  return (
    <main>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <WalletHeader />
          <LiFiWidget
            integrator="widget-connectkit-example"
            config={{
              theme: {
                container: {
                  border: '1px solid rgb(234, 234, 234)',
                  borderRadius: '16px',
                },
              },
            }}
            providers={[EthereumProvider()]}
          />
        </WalletProvider>
      </QueryClientProvider>
    </main>
  )
}

export default App
