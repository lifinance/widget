import type { Storage } from '@wagmi/core'
import { UserRejectedRequestError } from 'viem'
import type { CreateConnectorFn } from 'wagmi'
import { type WalletConnectParameters, walletConnect } from 'wagmi/connectors'
import {
  OATH_WALLET_ICON,
  OATH_WALLET_ID,
  OATH_WALLET_NAME,
} from '../config/oathWallet.js'
import type { CreateConnectorFnExtended } from '../types.js'
import { extendConnector } from '../utils/extendConnector.js'
import type { OathConnectionDialog } from './oathWalletDialog.js'

/** A named, opt-in entry using the same EVM protocol as WalletConnect. */
export const createOathWalletConnector = (
  params: WalletConnectParameters
): CreateConnectorFnExtended => {
  const factory: CreateConnectorFn = (config) => {
    let generation = 0
    let connecting = false
    let cancelPending: (() => void) | undefined
    const prefixKey = `oath-wallet.${params.projectId}.storagePrefix` as const
    const storage = config.storage as Storage<
      Record<typeof prefixKey, string>
    > | null
    const createBase = (storagePrefix: string, ownGeneration: number) => {
      const emitter = Object.create(config.emitter) as typeof config.emitter
      emitter.emit = (event, ...args) => {
        // A cancelled proposal can resolve after another attempt starts.
        if (ownGeneration === generation) {
          config.emitter.emit(event, ...args)
        }
      }
      const base = walletConnect({
        ...params,
        showQrModal: false,
        customStoragePrefix: storagePrefix,
      })({ ...config, emitter })
      const setRequestedChains = base.setRequestedChainsIds.bind(base)
      base.setRequestedChainsIds = (chains) => {
        if (ownGeneration === generation) {
          setRequestedChains(chains)
        }
      }
      return Object.assign(base, {
        id: OATH_WALLET_ID,
        name: OATH_WALLET_NAME,
        icon: OATH_WALLET_ICON,
      })
    }
    // Reuse the current namespace on reload, but never let an abandoned client
    // share persistence (or WalletConnect's cached Core) with its replacement.
    let base = Promise.resolve(storage?.getItem(prefixKey)).then((prefix) =>
      createBase(prefix || 'evm-oath-wallet', 0)
    )
    void base.catch(() => undefined)
    return {
      id: OATH_WALLET_ID,
      name: OATH_WALLET_NAME,
      icon: OATH_WALLET_ICON,
      type: 'walletConnect',
      setup: async () => {
        await (await base).setup?.()
      },
      getProvider: async (options) => (await base).getProvider(options),
      getAccounts: async () => (await base).getAccounts(),
      getChainId: async () => (await base).getChainId(),
      isAuthorized: async () => (await base).isAuthorized(),
      switchChain: async (options) => (await base).switchChain!(options),
      onAccountsChanged: async (accounts) =>
        (await base).onAccountsChanged(accounts),
      onChainChanged: async (chainId) => (await base).onChainChanged(chainId),
      onDisconnect: async (error) => (await base).onDisconnect(error),
      async disconnect() {
        if (cancelPending) {
          cancelPending()
          return
        }
        await (await base).disconnect()
      },
      async connect(options) {
        if (connecting) {
          throw new Error('An Oath connection is already pending.')
        }
        connecting = true
        try {
          const lifetime = new AbortController()
          const current = base
          const ownGeneration = generation
          let cancelled = false
          let finished = false
          let dialog: OathConnectionDialog | undefined
          let pairingTopic: string | undefined
          const disconnectedTopics = new Set<string>()
          let provider:
            | Awaited<ReturnType<Awaited<typeof base>['getProvider']>>
            | undefined
          let restoredTopic: string | undefined
          const disconnectLateSession = async () => {
            const topic = provider?.session?.topic
            if (
              !provider ||
              !topic ||
              topic === restoredTopic ||
              disconnectedTopics.has(topic)
            ) {
              return
            }
            disconnectedTopics.add(topic)
            // Disconnect this session only, never a newer retry's provider.
            await provider.signer.client
              .disconnect({
                topic,
                reason: { code: 6000, message: 'Oath connection cancelled' },
              })
              .catch(() => undefined)
          }
          let rejectCancellation: (error: Error) => void = () => undefined
          const cancellation = new Promise<never>((_, reject) => {
            rejectCancellation = reject
          })
          const cancel = (
            error: Error = new UserRejectedRequestError(
              new Error('Connection cancelled')
            )
          ) => {
            if (finished || cancelled) {
              return
            }
            cancelled = true
            generation++
            const replacementGeneration = generation
            const prefix = `evm-oath-wallet-${crypto.randomUUID()}`
            // Finish saving the namespace before starting its provider. Old
            // clients may still write, but only into their abandoned namespace.
            base = current
              .catch(() => undefined)
              .then(async () => {
                await storage?.setItem(prefixKey, prefix)
                return createBase(prefix, replacementGeneration)
              })
            void base.catch(() => undefined)
            lifetime.abort()
            rejectCancellation(error)
            if (pairingTopic && provider) {
              void provider.signer.client.core.pairing
                .disconnect({ topic: pairingTopic })
                .catch(() => undefined)
            }
            void disconnectLateSession()
          }
          cancelPending = cancel
          const onDisplayUri = (uri: string) => {
            if (cancelled || finished || ownGeneration !== generation) {
              return
            }
            pairingTopic = /^wc:([^@]+)@2\?/.exec(uri)?.[1]
            void import('./oathWalletDialog.js')
              .then(async ({ openOathConnectionDialog }) => {
                if (cancelled || finished || ownGeneration !== generation) {
                  return
                }
                dialog?.close()
                dialog = await openOathConnectionDialog(
                  uri,
                  cancel,
                  lifetime.signal
                )
                if (cancelled || finished || ownGeneration !== generation) {
                  dialog.close()
                }
              })
              .catch((error: unknown) => {
                cancel(
                  error instanceof Error
                    ? error
                    : new Error('Unable to open Oath connection')
                )
              })
          }
          // Cancellation is registered before either storage or provider loading.
          const pairing = (async () => {
            const connector = await current
            if (cancelled) {
              throw new UserRejectedRequestError(
                new Error('Connection cancelled')
              )
            }
            provider = await connector.getProvider()
            restoredTopic = provider.session?.topic
            if (cancelled) {
              throw new UserRejectedRequestError(
                new Error('Connection cancelled')
              )
            }
            provider.on('display_uri', onDisplayUri)
            try {
              const result = await connector.connect(options)
              if (cancelled) {
                await disconnectLateSession()
                throw new UserRejectedRequestError(
                  new Error('Connection cancelled')
                )
              }
              return result
            } finally {
              provider.removeListener('display_uri', onDisplayUri)
              if (cancelled) {
                void disconnectLateSession()
              }
            }
          })()
          try {
            return await Promise.race([pairing, cancellation])
          } finally {
            finished = true
            if (cancelPending === cancel) {
              cancelPending = undefined
            }
            lifetime.abort()
            dialog?.close()
          }
        } finally {
          connecting = false
        }
      },
    }
  }
  const extended = extendConnector(factory, OATH_WALLET_ID, OATH_WALLET_NAME)
  extended.icon = OATH_WALLET_ICON
  return extended
}
