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
 *
 * ## Connector name/icon
 *
 * wagmi's `setup()` spreads the factory return value (`{ ...connectorFn() }`),
 * which flattens getters into static values. Since the host wallet's connector
 * info arrives asynchronously via the bridge, we store a reference to the
 * spread object and mutate `name`/`icon` on it when the info arrives.
 */
export function widgetLightConnector() {
  let provider_: EthereumIframeProvider | undefined
  let latestEmitter: ConnectorEmitter
  // Reference to the connector object wagmi creates via spread.
  // We mutate `name`/`icon` on it when the host sends connector info.
  let connectorRef: Record<string, unknown> | undefined

  function updateConnectorInfo() {
    if (!connectorRef || !provider_) {
      return
    }
    const info = provider_.connector
    if (info?.name) {
      connectorRef.name = info.name
      connectorRef.icon = info.icon
    }
  }

  return createConnector<EthereumIframeProvider | undefined>((config) => {
    latestEmitter = config.emitter

    return {
      id: 'widget-light-iframe',
      name: 'Widget Light',
      type: widgetLightConnector.type,

      async setup() {
        // wagmi calls setup() on the spread connector object, so `this`
        // is the actual connector instance stored in wagmi's state.
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        connectorRef = this as unknown as Record<string, unknown>
      },

      async getProvider() {
        connectorRef ??= this as unknown as Record<string, unknown>
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

          // When bridge init delivers connector info from the host,
          // mutate the wagmi connector object so the widget displays
          // the real wallet name/icon (e.g. "MetaMask") instead of
          // the fallback "Widget Light".
          provider_.on('connectorUpdate', updateConnectorInfo)

          // If init already fired during construction (bridge INIT arrived
          // before getProvider() was called), the connectorUpdate event was
          // emitted before this listener existed. Apply eagerly.
          updateConnectorInfo()
        }
        return provider_
      },

      async isAuthorized() {
        const accounts = await this.getAccounts().catch(() => [])
        return accounts.length > 0
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

      onAccountsChanged(accounts: string[]) {
        latestEmitter.emit('change', {
          accounts: accounts.map(getAddress),
        })
      },

      onChainChanged(chainId: string | number) {
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

widgetLightConnector.type = 'widget-light-iframe' as const
