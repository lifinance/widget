<template>
  <Widget :config="config" />
</template>

<script lang="ts">
import { applyPureReactInVue } from 'veaury';
// This is a React component
import { LiFiWidget } from '@lifi/widget';

export default {
  components: {
    // Use HOC 'applyReactInVue' or 'applyPureReactInVue'
    // Basic: applyReactInVue(LiFiWidget),
    Widget: applyPureReactInVue(LiFiWidget)
  },
  setup() {
    return {
      config: {
        containerStyle: {
          border: `1px solid rgb(234, 234, 234)`,
          borderRadius: '16px',
        },
        integrator: 'vue-example'
      },
    }
  }
}
</script>
