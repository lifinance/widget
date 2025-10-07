<template>
  <Widget :config="config" />
</template>

<script lang="ts">
// This is a React component
import { LiFiWidget } from '@lifi/widget'
import { EVMProvider } from '@lifi/wallet-provider-evm'
import { applyPureReactInVue } from 'veaury'

export default {
  components: {
    // Use HOC 'applyReactInVue' or 'applyPureReactInVue'
    // Basic: applyReactInVue(LiFiWidget),
    Widget: applyPureReactInVue(LiFiWidget),
  },
  setup() {
    return {
      config: {
        theme: {
          container: {
            border: '1px solid rgb(234, 234, 234)',
            borderRadius: '16px',
          },
        },
        integrator: 'vue-example',
        walletProviders: [EVMProvider],
      },
    }
  },
}
</script>
