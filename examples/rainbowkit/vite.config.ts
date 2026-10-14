import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  // pnpm resolves wagmi through separate peer instances; one bundled copy keeps
  // WagmiProvider's context visible to every wagmi hook.
  resolve: {
    dedupe: ['wagmi', '@wagmi/core', 'viem'],
  },
})
