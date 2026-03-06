import {
  type CreateConnectorFn,
  createConnector,
  ProviderNotFoundError,
} from '@wagmi/core'
import { type Chain, fromHex, getAddress, type Hex, toHex } from 'viem'
import { EthereumIframeProvider } from './EthereumIframeProvider.js'

type ConnectorEmitter = Parameters<CreateConnectorFn>[0]['emitter']

/**
 * Wagmi v3 connector that bridges the LI.FI Widget (running in an iframe) to
 * the parent window's wallet via postMessage.
 *
 * ## Surviving `syncWagmiConfig` / connector re-creation
 *
 * `syncWagmiConfig` replaces all connectors by calling `connectors.setState()`
 * which re-invokes this factory with a fresh `config` (and a new `emitter`).
 * Standard connectors (e.g. `injected`) survive because their provider is
 * external (`window.ethereum`). Ours is internal (`EthereumIframeProvider`
 * singleton).
 *
 * To keep provider event listeners pointing at the **current** wagmi emitter
 * after re-creation, we store a mutable `latestEmitter` ref in the outer
 * `widgetLightIframe()` closure. It is updated on every factory invocation.
 * The provider's listeners read from this ref instead of capturing the
 * original `config.emitter`.
 */
widgetLightConnector.type = 'widget-light-iframe' as const

export function widgetLightConnector() {
  let provider_: EthereumIframeProvider | undefined
  let latestEmitter: ConnectorEmitter

  return createConnector<EthereumIframeProvider | undefined>((config) => {
    latestEmitter = config.emitter

    return {
      id: 'widget-light-iframe',
      name: 'Widget Light',
      type: widgetLightConnector.type,

      async setup() {
        await this.getProvider()
      },

      async getProvider() {
        if (typeof window === 'undefined' || window.parent === window) {
          return undefined
        }
        if (!provider_) {
          provider_ = new EthereumIframeProvider()

          provider_.on('accountsChanged', (accounts: unknown) => {
            const addrs = (accounts as string[]).map(getAddress)

            if (addrs.length > 0) {
              const chainId = fromHex(provider_!.chainIdHex, 'number')
              latestEmitter.emit('connect', { accounts: addrs, chainId })
            } else {
              latestEmitter.emit('disconnect')
            }
          })

          provider_.on('chainChanged', (chainId: unknown) => {
            const id = fromHex(chainId as Hex, 'number')
            latestEmitter.emit('change', { chainId: id })
          })

          provider_.on('disconnect', () => {
            latestEmitter.emit('disconnect')
          })
        }
        return provider_
      },

      async isAuthorized() {
        try {
          const accounts = await this.getAccounts()
          const result = accounts.length > 0
          return result
        } catch {
          return false
        }
      },

      async connect({ withCapabilities } = {}) {
        const provider = await this.getProvider()
        if (!provider) {
          throw new ProviderNotFoundError()
        }

        const accounts = await this.getAccounts()
        const chainId = await this.getChainId()

        if (accounts.length === 0) {
          throw new Error(
            'No accounts — connect a wallet in the host window first'
          )
        }

        return {
          accounts: (withCapabilities
            ? accounts.map((address) => ({ address, capabilities: {} }))
            : accounts) as never,
          chainId,
        }
      },

      async disconnect() {
        latestEmitter.emit('disconnect')
      },

      async switchChain({ chainId }: { chainId: number }): Promise<Chain> {
        const provider = await this.getProvider()
        if (!provider) {
          throw new ProviderNotFoundError()
        }
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: toHex(chainId) }],
        })
        const chain = config.chains.find((c) => c.id === chainId)
        if (!chain) {
          throw new Error(`Chain ${chainId} not configured`)
        }
        return chain
      },

      async getAccounts() {
        const provider = await this.getProvider()
        if (!provider) {
          throw new ProviderNotFoundError()
        }
        const accounts = (await provider.request({
          method: 'eth_accounts',
        })) as string[]
        return accounts.map(getAddress)
      },

      async getChainId() {
        const provider = await this.getProvider()
        if (!provider) {
          throw new ProviderNotFoundError()
        }
        const chainId = (await provider.request({
          method: 'eth_chainId',
        })) as Hex
        return fromHex(chainId, 'number')
      },

      onAccountsChanged(accounts) {
        latestEmitter.emit('change', {
          accounts: accounts.map(getAddress),
        })
      },

      onChainChanged(chainId) {
        latestEmitter.emit('change', {
          chainId: typeof chainId === 'string' ? Number(chainId) : chainId,
        })
      },

      onDisconnect() {
        latestEmitter.emit('disconnect')
      },
    }
  })
}
