<template>
  <lifi-widget :config="config" />
</template>

<script>
import { LiFiWidget } from '@lifi/widget';

export default {
  components: { 'lifi-widget': LiFiWidget },
  data() {
    return {
      config: {
        containerStyle: {
          border: `1px solid rgb(234, 234, 234)`,
          borderRadius: '16px',
        },
      }
    }
  },
}
</script>
