import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import EnvCompatible from 'vite-plugin-env-compatible'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), EnvCompatible()],
  // pnpm resolves wagmi through separate peer instances; one bundled copy keeps
  // WagmiProvider's context visible to every wagmi hook.
  resolve: {
    dedupe: ['wagmi', '@wagmi/core', 'viem'],
  },
})
