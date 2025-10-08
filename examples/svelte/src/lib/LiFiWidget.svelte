<script>
import { EthereumProvider } from '@lifi/wallet-provider-evm'
import { LiFiWidget } from '@lifi/widget'
import ReactAdapter from './ReactAdapter.svelte'
</script>

<ReactAdapter
  element={LiFiWidget}
  config={{
    theme: {
      container: {
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
        borderRadius: '16px',
      },
    },
  }}
  integrator="svelte-example"
  providers={[EthereumProvider()]}
/>

<style>
  /**
   * Styling a React Component from within a Svelte Component.
   */
</style>
