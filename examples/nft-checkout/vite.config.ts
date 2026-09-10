import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [nodePolyfills(), react()],
  // The example calls wagmi hooks itself while WagmiProvider comes from
  // @lifi/widget-provider-ethereum. pnpm 12 resolves those two through separate
  // peer instances of the same wagmi version, and React context does not cross
  // module instances, so useConfig() would throw WagmiProviderNotFoundError.
  // Collapse them to one copy at bundle time.
  resolve: {
    dedupe: ['wagmi', '@wagmi/core', 'viem'],
  },
  oxc: {
    target: 'esnext',
  },
  build: {
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
})
