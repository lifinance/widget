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
    const createBase = () => {
      const ownGeneration = generation
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
        customStoragePrefix: 'evm-oath-wallet',
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
    let base = createBase()
    return {
      id: OATH_WALLET_ID,
      name: OATH_WALLET_NAME,
      icon: OATH_WALLET_ICON,
      type: 'walletConnect',
      setup: async () => {
        await base.setup?.()
      },
      getProvider: (options) => base.getProvider(options),
      getAccounts: () => base.getAccounts(),
      getChainId: () => base.getChainId(),
      isAuthorized: () => base.isAuthorized(),
      switchChain: (options) => base.switchChain!(options),
      onAccountsChanged: (accounts) => base.onAccountsChanged(accounts),
      onChainChanged: (chainId) => base.onChainChanged(chainId),
      onDisconnect: (error) => base.onDisconnect(error),
      async disconnect() {
        if (cancelPending) {
          cancelPending()
          return
        }
        await base.disconnect()
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
          const provider = await current.getProvider()
          const restoredTopic = provider.session?.topic
          const disconnectLateSession = async () => {
            const topic = provider.session?.topic
            if (
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
            base = createBase()
            lifetime.abort()
            rejectCancellation(error)
            if (pairingTopic) {
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
          provider.on('display_uri', onDisplayUri)
          const pairing = current
            .connect(options)
            .then(async (result) => {
              if (cancelled) {
                await disconnectLateSession()
                throw new UserRejectedRequestError(
                  new Error('Connection cancelled')
                )
              }
              return result
            })
            .finally(() => {
              provider.removeListener('display_uri', onDisplayUri)
              if (cancelled) {
                void disconnectLateSession()
              }
            })
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
