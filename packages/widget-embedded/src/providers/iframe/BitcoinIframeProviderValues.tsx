import { ChainId, ChainType } from '@lifi/sdk'
import { BitcoinProvider as BitcoinSDKProvider } from '@lifi/sdk-provider-bitcoin'
import { BitcoinContext } from '@lifi/widget-provider'
import {
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { IframeConnectorInfo } from './BaseIframeProvider.js'
import { BitcoinIframeProvider } from './BitcoinIframeProvider.js'

interface IframeWalletState {
  accounts: string[]
  connected: boolean
  connector: IframeConnectorInfo
}

/**
 * Guest-side (iframe) Bitcoin context provider.
 *
 * Reads wallet state from BitcoinIframeProvider (which receives it from the
 * host via GuestBridge) and exposes it through BitcoinContext so the widget
 * can display the connected account and execute transactions.
 */
export const BitcoinIframeProviderValues: FC<PropsWithChildren> = ({
  children,
}) => {
  const providerRef = useRef<BitcoinIframeProvider>(null)
  if (!providerRef.current) {
    providerRef.current = new BitcoinIframeProvider()
  }
  const provider = providerRef.current

  const [walletState, setWalletState] = useState<IframeWalletState>({
    accounts: provider.accounts,
    connected: provider.connected,
    connector: provider.connector,
  })

  useEffect(() => {
    const onAccountsChanged = (accounts: unknown) => {
      const accts = accounts as string[]
      setWalletState((s) => ({
        ...s,
        accounts: accts,
        connected: accts.length > 0,
      }))
    }

    const onConnect = () => {
      setWalletState({
        accounts: provider.accounts,
        connected: true,
        connector: provider.connector,
      })
    }

    const onDisconnect = () => {
      setWalletState({ accounts: [], connected: false, connector: {} })
    }

    provider.on('accountsChanged', onAccountsChanged)
    provider.on('connect', onConnect)
    provider.on('disconnect', onDisconnect)

    return () => {
      provider.removeListener('accountsChanged', onAccountsChanged)
      provider.removeListener('connect', onConnect)
      provider.removeListener('disconnect', onDisconnect)
      provider.destroy()
    }
  }, [provider])

  const address = walletState.accounts[0] ?? null
  const isConnected = walletState.connected && !!address
  const connectorName = walletState.connector.name
  const connectorIcon = walletState.connector.icon

  const account = useMemo(
    () => ({
      address: address ?? undefined,
      addresses: address ? [address] : [],
      chainType: ChainType.UTXO,
      chainId: ChainId.BTC,
      connector: isConnected
        ? {
            name: connectorName ?? 'Bitcoin Wallet',
            icon: connectorIcon,
          }
        : undefined,
      isConnected,
      isConnecting: false,
      isReconnecting: false,
      isDisconnected: !isConnected,
      status: (isConnected ? 'connected' : 'disconnected') as
        | 'connected'
        | 'disconnected',
    }),
    [address, isConnected, connectorName, connectorIcon]
  )

  const sdkProvider = useMemo(
    () =>
      BitcoinSDKProvider({
        async getWalletClient() {
          if (!provider.address) {
            throw new Error('Bitcoin wallet not connected')
          }
          // Cast required: the SDK types expect a full bigmi Client, but the
          // executor only uses client.account and client.request() at runtime.
          return createIframeBitcoinClient(provider) as any
        },
      }),
    [provider]
  )

  const contextValue = useMemo(
    () => ({
      isEnabled: true,
      account,
      sdkProvider,
      installedWallets: [] as [],
      isConnected,
      isExternalContext: true,
      connect: async () => {},
      disconnect: async () => {},
    }),
    [account, sdkProvider, isConnected]
  )

  return (
    <BitcoinContext.Provider value={contextValue}>
      {children}
    </BitcoinContext.Provider>
  )
}

/**
 * Creates a minimal bigmi-compatible wallet client that delegates all
 * operations to the host via the iframe bridge.
 *
 * The `BitcoinStepExecutor` uses:
 *   - `client.account.address` / `.publicKey` for PSBT input processing
 *   - `client.request({ method, params })` via bigmi's `signPsbt()` action
 */
function createIframeBitcoinClient(provider: BitcoinIframeProvider) {
  return {
    account: {
      address: provider.address!,
      publicKey: provider.publicKey ?? '',
    },
    async request({ method, params }: { method: string; params?: unknown }) {
      return provider.request(method, params)
    },
  }
}
