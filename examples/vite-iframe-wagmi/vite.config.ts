import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
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
  server: {
    port: 4000,
    open: true,
  },
})
