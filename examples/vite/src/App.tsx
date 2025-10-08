import { LiFiWidget } from '@lifi/widget'
import { EthereumProvider } from '@lifi/widget-provider-ethereum'

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
      providers={[EthereumProvider()]}
    />
  )
}
