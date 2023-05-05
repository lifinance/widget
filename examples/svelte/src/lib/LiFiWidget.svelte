<script>
  import { LiFiWidget } from '@lifi/widget';
  import ReactAdapter from './ReactAdapter.svelte';
</script>

<ReactAdapter
  element={LiFiWidget}
  config={{
    containerStyle: {
      border: `1px solid rgb(234, 234, 234)`,
      borderRadius: '16px',
    },
  }}
  integrator="svelte-example"
/>

<style>
  /**
   * Styling a React Component from within a Svelte Component.
   */
</style>
