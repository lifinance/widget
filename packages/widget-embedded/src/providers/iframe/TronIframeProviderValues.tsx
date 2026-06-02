import { ChainId, ChainType } from '@lifi/sdk'
import { TronProvider as TronSDKProvider } from '@lifi/sdk-provider-tron'
import { TronContext } from '@lifi/widget-provider'
import {
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { IframeConnectorInfo } from './BaseIframeProvider.js'
import { IframeTronAdapter } from './IframeTronAdapter.js'
import { TronIframeProvider } from './TronIframeProvider.js'

interface IframeWalletState {
  accounts: string[]
  connected: boolean
  connector: IframeConnectorInfo
}

/**
 * Guest-side (iframe) Tron context provider.
 *
 * Reads wallet state from TronIframeProvider (which receives it from the
 * host via GuestBridge) and exposes it through TronContext so the widget
 * can display the connected account and execute transactions.
 */
export const TronIframeProviderValues: FC<PropsWithChildren> = ({
  children,
}) => {
  const providerRef = useRef<TronIframeProvider>(null)
  if (!providerRef.current) {
    providerRef.current = new TronIframeProvider()
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
    provider.connect()

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
    () =>
      isConnected
        ? {
            address,
            chainId: ChainId.TRN,
            chainType: ChainType.TVM,
            connector: {
              name: connectorName ?? 'Tron Wallet',
              icon: connectorIcon,
            },
            isConnected: true as const,
            isConnecting: false,
            isReconnecting: false,
            isDisconnected: false,
            status: 'connected' as const,
          }
        : {
            chainType: ChainType.TVM,
            isConnected: false as const,
            isConnecting: false,
            isReconnecting: false,
            isDisconnected: true,
            status: 'disconnected' as const,
          },
    [address, isConnected, connectorName, connectorIcon]
  )

  const sdkProvider = useMemo(
    () =>
      TronSDKProvider({
        multicallBatchSize: 50,
        async getWallet() {
          if (!provider.address) {
            throw new Error('Tron wallet not connected')
          }
          return new IframeTronAdapter(provider)
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
    <TronContext.Provider value={contextValue}>{children}</TronContext.Provider>
  )
}
