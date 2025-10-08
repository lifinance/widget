import { EVMProvider } from '@lifi/wallet-provider-evm'
import { LiFiWidget } from '@lifi/widget'

export function App() {
  return (
    <LiFiWidget
      integrator="vite-example"
      config={{
        theme: {
          container: {
            border: '1px solid rgb(234, 234, 234)',
            borderRadius: '16px',
          },
        },
      }}
      walletProviders={[EVMProvider()]}
    />
  )
}
