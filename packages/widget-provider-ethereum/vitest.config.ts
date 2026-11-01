import { createRequire } from 'node:module'
import { defineConfig } from 'vitest/config'

const require = createRequire(import.meta.url)
const wagmiRequire = createRequire(require.resolve('wagmi/connectors'))
const connectorsRequire = createRequire(
  wagmiRequire.resolve('@wagmi/connectors')
)

export default defineConfig({
  resolve: {
    alias: {
      '@walletconnect/ethereum-provider': connectorsRequire.resolve(
        '@walletconnect/ethereum-provider'
      ),
    },
  },
  test: {
    // Exercise the real Wagmi connector while substituting the relay provider.
    server: { deps: { inline: [/wagmi/] } },
  },
})
