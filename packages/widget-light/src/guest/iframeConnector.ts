import {
  type CreateConnectorFn,
  createConnector,
  ProviderNotFoundError,
} from '@wagmi/core'
import { fromHex, getAddress, type Hex } from 'viem'
import { IframeProvider } from './IframeProvider.js'

type ConnectorEmitter = Parameters<CreateConnectorFn>[0]['emitter']

// biome-ignore lint/suspicious/noConsole: intentional debug logging
const LOG = (...args: unknown[]) => console.log('[iframeConnector]', ...args)

/**
 * Wagmi v3 connector that bridges the LI.FI Widget (running in an iframe) to
 * the parent window's wallet via postMessage.
 *
 * ## Surviving `syncWagmiConfig` / connector re-creation
 *
 * `syncWagmiConfig` replaces all connectors by calling `connectors.setState()`
 * which re-invokes this factory with a fresh `config` (and a new `emitter`).
 * Standard connectors (e.g. `injected`) survive because their provider is
 * external (`window.ethereum`). Ours is internal (`IframeProvider` singleton).
 *
 * To keep provider event listeners pointing at the **current** wagmi emitter
 * after re-creation, we store a mutable `latestEmitter` ref in the outer
 * `widgetLightIframe()` closure. It is updated on every factory invocation.
 * The provider's listeners read from this ref instead of capturing the
 * original `config.emitter`.
 *
 * ## `setup()` and `reconnectOnMount`
 *
 * A `setup()` method creates the IframeProvider eagerly during connector
 * registration, ensuring READY messages are sent to the host even when
 * `reconnectOnMount` is `false` (required when using `useSyncWagmiConfig`).
 *
 * ## Why the 'connect' listener matters
 *
 * wagmi's reconnect action swaps the 'connect' listener for 'change' +
 * 'disconnect' only after `connect()` succeeds. If `isAuthorized()` returns
 * false, wagmi skips the connector, keeping the 'connect' listener alive for
 * the first real wallet attach from the host.
 */
widgetLightIframe.type = 'widget-light-iframe' as const

export function widgetLightIframe() {
  let provider_: IframeProvider | undefined
  // Mutable ref — updated on every factory invocation (including after
  // syncWagmiConfig) so provider listeners always fire on the current
  // wagmi emitter.
  let latestEmitter: ConnectorEmitter

  return createConnector<IframeProvider | undefined>((config) => {
    latestEmitter = config.emitter

    return {
      id: 'widget-light-iframe',
      name: 'Widget Light',
      type: widgetLightIframe.type,

      // -----------------------------------------------------------------
      // setup — called once per connector registration (including after
      // syncWagmiConfig re-creates the connector). Creates the provider
      // singleton eagerly so READY messages are sent to the host even
      // when reconnectOnMount is false.
      // -----------------------------------------------------------------
      async setup() {
        await this.getProvider()
      },

      // -----------------------------------------------------------------
      // getProvider — creates the singleton and wires EIP-1193 events
      // into wagmi the first time it is called. Listeners use
      // `latestEmitter` so they survive connector re-creation.
      // -----------------------------------------------------------------
      async getProvider() {
        if (typeof window === 'undefined' || window.parent === window) {
          LOG('getProvider — not in iframe, returning undefined')
          return undefined
        }
        if (!provider_) {
          LOG('getProvider — creating IframeProvider singleton')
          provider_ = new IframeProvider()

          provider_.on('accountsChanged', (accounts: unknown) => {
            const addrs = (accounts as string[]).map(getAddress)
            LOG('accountsChanged received →', addrs)
            LOG(
              'wagmi emitter listenerCount("connect"):',
              latestEmitter.listenerCount('connect')
            )
            LOG(
              'wagmi emitter listenerCount("change"):',
              latestEmitter.listenerCount('change')
            )
            LOG(
              'wagmi emitter listenerCount("disconnect"):',
              latestEmitter.listenerCount('disconnect')
            )

            if (addrs.length > 0) {
              const chainId = fromHex(provider_!.chainIdHex, 'number')
              LOG('→ emitting wagmi "connect" with', {
                accounts: addrs,
                chainId,
              })
              latestEmitter.emit('connect', { accounts: addrs, chainId })
            } else {
              LOG('→ emitting wagmi "disconnect"')
              latestEmitter.emit('disconnect')
            }
          })

          provider_.on('chainChanged', (chainId: unknown) => {
            const id = fromHex(chainId as Hex, 'number')
            LOG('chainChanged received → emitting wagmi "change" chainId:', id)
            latestEmitter.emit('change', { chainId: id })
          })

          provider_.on('disconnect', () => {
            LOG('disconnect received → emitting wagmi "disconnect"')
            latestEmitter.emit('disconnect')
          })
        } else {
          LOG('getProvider — returning existing singleton')
        }
        return provider_
      },

      // -----------------------------------------------------------------
      // isAuthorized — returns true only when the parent already has
      // accounts. Returning false preserves the 'connect' listener.
      // -----------------------------------------------------------------
      async isAuthorized() {
        try {
          const accounts = await this.getAccounts()
          const result = accounts.length > 0
          LOG('isAuthorized →', result, '(accounts:', accounts, ')')
          return result
        } catch (err) {
          LOG('isAuthorized → false (error:', err, ')')
          return false
        }
      },

      // -----------------------------------------------------------------
      // connect — called by wagmi on explicit connectAsync() or after
      // isAuthorized() returns true during reconnect.
      // -----------------------------------------------------------------
      async connect({ withCapabilities } = {}) {
        LOG('connect() called')
        const provider = await this.getProvider()
        if (!provider) {
          throw new ProviderNotFoundError()
        }

        const accounts = await this.getAccounts()
        const chainId = await this.getChainId()
        LOG('connect() — accounts:', accounts, 'chainId:', chainId)

        if (accounts.length === 0) {
          LOG(
            'connect() — no accounts, throwing to preserve "connect" listener'
          )
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

      // -----------------------------------------------------------------
      // disconnect — only updates wagmi state; never touches the provider.
      // -----------------------------------------------------------------
      async disconnect() {
        LOG('disconnect() called → emitting wagmi "disconnect"')
        latestEmitter.emit('disconnect')
      },

      // -----------------------------------------------------------------
      // getAccounts / getChainId — served from provider cache
      // -----------------------------------------------------------------
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

      // -----------------------------------------------------------------
      // Standard wagmi event callbacks
      // -----------------------------------------------------------------
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
